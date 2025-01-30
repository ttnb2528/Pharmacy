import Order from "../model/Order.model.js";
import OrderDetail from "../model/OrderDetail.model.js";
import Medicine from "../model/Medicine.model.js";
import Batch from "../model/Batch.model.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Joi from "joi";
import { generateID } from "../utils/generateID.js";
import LoyaltyProgram from "../model/LoyaltyProgram.model.js";
import PointHistory from "../model/PointHistory.model.js";

export const createOrder = asyncHandler(async (req, res) => {
  try {
    const { cart, ...data } = req.body;
    // console.log(data);

    const { error } = validate(data);

    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }

    // Chuyển đổi cart object thành array để dễ xử lý chi lay ra những sản phẩm có số lượng > 0
    const cartItems = Object.entries(cart)
      .map(([productId, quantity]) => ({
        productId,
        quantity,
      }))
      .filter((item) => item.quantity > 0);

    // console.log(cartItems);

    // Kiểm tra và lấy thông tin sản phẩm
    const medicineIds = cartItems.map((item) => item.productId);
    const medicines = await Medicine.find({ id: { $in: medicineIds } })
      .populate("categoryId")
      .populate("brandId");

    for (let medicine of medicines) {
      const batches = await Batch.find({ MedicineId: medicine._id })
        .populate("SupplierId")
        .populate("ManufactureId");
      medicine._doc.batches = batches;
    }

    // console.log(medicines);

    // if (medicines.length !== medicineIds.length) {
    //   return res.json(
    //     jsonGenerate(StatusCode.BAD_REQUEST, "Một số sản phẩm không tồn tại")
    //   );
    // }

    // Kiểm tra số lượng tồn kho
    for (const item of cartItems) {
      const medicine = medicines.find(
        (m) => m.id.toString() === item.productId
      );

      if (medicine.quantityStock < item.quantity) {
        return res.json(
          jsonGenerate(
            StatusCode.BAD_REQUEST,
            `Opp có vẻ như sản phẩm ${medicine.name} tạm hết hàng rồi! Xin lỗi vì sự bất tiện này!`
          )
        );
      }
    }

    let id = await generateID(Order);

    const newOrder = new Order({
      id: id,
      ...data,
    });

    const order = await newOrder.save();

    // Tạo chi tiết đơn hàng
    const orderItems = cartItems.map((item) => {
      const medicine = medicines.find(
        (m) => m.id.toString() === item.productId
      );

      return {
        productId: medicine._id, // Sử dụng _id của medicine
        quantity: item.quantity,
        price: medicine.batches[0].price,
        name: medicine.name,
        unit: medicine.unit,
        discount: medicine.isDiscount ? medicine.percentDiscount : 0,
      };
    });

    const orderDetail = new OrderDetail({
      orderId: order._id,
      items: orderItems,
    });

    await orderDetail.save();

    // Cập nhật số lượng tồn kho và số lượng đã bán
    const bulkOps = cartItems.map((item) => ({
      updateOne: {
        filter: { id: item.productId },
        update: {
          $inc: {
            quantityStock: -item.quantity,
            sold: item.quantity,
          },
        },
      },
    }));

    await Medicine.bulkWrite(bulkOps);

    res.json(
      jsonGenerate(StatusCode.CREATED, "Tạo đơn hàng thành công", {
        order,
        orderDetail,
      })
    );

    // let id = await generateID(Order);

    // const newOrder = new Order({
    //   id: id,
    //   ...data,
    // });

    // const order = await newOrder.save();

    // res.json(
    //   jsonGenerate(StatusCode.CREATED, "Tạo đơn hàng thành công", order)
    // );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find().populate("AccountId");

    res.json(
      jsonGenerate(StatusCode.OK, "Lấy danh sách đơn hàng thành công", orders)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getCurrentUserOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({
      AccountId: req.user._id,
    }).populate("AccountId");

    res.json(
      jsonGenerate(StatusCode.OK, "Lấy danh sách đơn hàng thành công", orders)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("AccountId");

    if (!order) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy đơn hàng")
      );
    }

    res.json(jsonGenerate(StatusCode.OK, "Lấy đơn hàng thành công", order));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getOrderDetail = asyncHandler(async (req, res) => {
  try {
    const orderExist = await Order.findOne({ id: req.params.orderId });

    if (!orderExist) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy đơn hàng")
      );
    }

    const orderDetail = await OrderDetail.findOne({
      orderId: orderExist._id,
    })
      .populate("items.productId")
      .populate("orderId");

    if (!orderDetail) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy chi tiết đơn hàng")
      );
    }

    res.json(
      jsonGenerate(
        StatusCode.OK,
        "Lấy chi tiết đơn hàng thành công",
        orderDetail
      )
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const deleteOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy đơn hàng")
      );
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json(jsonGenerate(StatusCode.OK, "Xóa đơn hàng thành công"));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const updateStatusOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.orderId });

    if (!order) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy đơn hàng")
      );
    }

    let points = 0;
    if (req.body.status === "processing") {
      const existingPointHistory = await PointHistory.findOne({
        orderId: order._id,
      });
      if (existingPointHistory) {
        await Order.findByIdAndUpdate(order._id, { status: req.body.status });

        return res.json(
          jsonGenerate(
            StatusCode.CONTINUE,
            "Đơn hàng này đã được tích điểm, chỉ cập nhật trạng thái"
          )
        );
      }

      const { total, AccountId } = order;
      const loyaltyProgram = await LoyaltyProgram.findOne({ AccountId });

      if (loyaltyProgram) {
        switch (loyaltyProgram.rank) {
          case "Bạc":
            points = total * 0.01;
            break;
          case "Vàng":
            points = total * 0.015;
            break;
          case "Kim cương":
            points = total * 0.02;
            break;
          default:
            break;
        }
      }

      await Order.findByIdAndUpdate(order._id, { status: req.body.status });
      await LoyaltyProgram.findOneAndUpdate(
        { AccountId },
        {
          $inc: {
            points,
            totalSpending: total,
          },
        }
      );

      if (points > 0) {
        await PointHistory.create({
          AccountId: order.AccountId,
          orderId: order._id,
          change: points,
          createdAt: new Date(),
          description: `Tích điểm từ đơn hàng ${order.id}`,
        });

        return res.json(
          jsonGenerate(StatusCode.OK, "Cập nhật trạng thái đơn hàng thành công")
        );
      }
    } else {
      await Order.findByIdAndUpdate(order._id, { status: req.body.status });
      return res.json(
        jsonGenerate(StatusCode.OK, "Cập nhật trạng thái đơn hàng thành công")
      );
    }
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

const validate = (data) => {
  const schema = Joi.object({
    nameCustomer: Joi.string().required().label("Tên khách hàng"),
    total: Joi.number().required().label("Tổng tiền"),
    address: Joi.string().required().label("Địa chỉ"),
    paymentMethod: Joi.string().required().label("Phương thức thanh toán"),
  })
    .messages({
      "string.empty": "{#label} không được để trống",
      "any.required": "{#label} là bắt buộc",
      "string.base": "{#label} phải là chuỗi ký tự",
      "date.base": "{#label} phải là ngày tháng",
      "number.base": "{#label} phải là số",
    })
    .unknown(true);

  return schema.validate(data);
};
