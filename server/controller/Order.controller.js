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
import Coupon from "../model/Coupon.model.js";
import CouponUsage from "../model/CouponUsage.model.js";

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

    // Xử lý coupon nếu có
    if (data.coupon) {
      const coupon = await Coupon.findOne({
        coupon_code: data.coupon,
        status: "active",
        end_date: { $gt: new Date() },
        quantity: { $gt: 0 },
      });

      if (!coupon) {
        return res.json(
          jsonGenerate(StatusCode.BAD_REQUEST, "Mã giảm giá không hợp lệ")
        );
      }

      // Kiểm tra số lần sử dụng của user
      const couponUsage = await CouponUsage.findOne({
        couponId: coupon._id,
        accountId: req.user._id,
      });

      if (couponUsage && couponUsage.usageCount >= coupon.maximum_uses) {
        return res.json(
          jsonGenerate(
            StatusCode.BAD_REQUEST,
            "Bạn đã hết lượt sử dụng mã giảm giá này"
          )
        );
      }

      // Cập nhật số lượng và lịch sử sử dụng
      await Coupon.findByIdAndUpdate(coupon._id, { $inc: { quantity: -1 } });

      if (couponUsage) {
        await CouponUsage.findByIdAndUpdate(couponUsage._id, {
          $inc: { usageCount: 1 },
          lastUsedDate: new Date(),
        });

        console.log("Update coupon usage");
      } else {
        console.log("Create coupon usage");

        await CouponUsage.create({
          couponId: coupon._id,
          accountId: req.user._id,
          usageCount: 1,
          lastUsedDate: new Date(),
        });
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
        discount: medicine.isDiscount ? medicine.discountPercentage : 0,
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

export const getOrderByVnpTxnRef = asyncHandler(async (req, res) => {
  const { vnpTxnRef } = req.query;
  console.log(vnpTxnRef);

  const order = await Order.findOne({ vnpTxnRef });
  if (!order) {
    return res.json(
      jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy đơn hàng")
    );
  }
  return res.json(
    jsonGenerate(StatusCode.OK, "Lấy đơn hàng thành công", { order })
  );
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

    const { status, vnpTransactionDate } = req.body;

    // Nếu đơn hàng bị hủy (cancelled)
    if (req.body.status === "cancelled") {
      // Lấy chi tiết đơn hàng
      const orderDetail = await OrderDetail.findOne({ orderId: order._id });

      // Hoàn trả số lượng sản phẩm
      const bulkOps = orderDetail.items.map((item) => ({
        updateOne: {
          filter: { _id: item.productId },
          update: {
            $inc: {
              quantityStock: item.quantity,
              sold: -item.quantity,
            },
          },
        },
      }));

      await Medicine.bulkWrite(bulkOps);

      // Nếu đơn hàng có sử dụng coupon
      if (order.coupon) {
        // Tăng lại số lượng coupon
        await Coupon.findOneAndUpdate(
          { coupon_code: order.coupon },
          { $inc: { quantity: 1 } }
        );

        // Giảm lượt sử dụng coupon của user
        const coupon = await Coupon.findOne({ coupon_code: order.coupon });
        if (coupon) {
          const couponUsage = await CouponUsage.findOne({
            couponId: coupon._id,
            accountId: order.AccountId,
          });

          if (couponUsage) {
            if (couponUsage.usageCount > 1) {
              await CouponUsage.findByIdAndUpdate(couponUsage._id, {
                $inc: { usageCount: -1 },
              });
            } else {
              // Nếu chỉ sử dụng 1 lần thì xóa luôn record
              await CouponUsage.findByIdAndDelete(couponUsage._id);
            }
          }
        }
      }

      // Nếu đơn hàng đã được tích điểm, hoàn lại điểm
      const pointHistory = await PointHistory.findOne({ orderId: order._id });
      if (pointHistory) {
        await LoyaltyProgram.findOneAndUpdate(
          { AccountId: order.AccountId },
          {
            $inc: {
              points: -pointHistory.change,
              totalSpending: -order.total,
            },
          }
        );

        // Xóa lịch sử tích điểm của đơn hàng này
        await PointHistory.findByIdAndDelete(pointHistory._id);
      }

      // Cập nhật status của đơn hàng thành cancelled
      await Order.findByIdAndUpdate(order._id, { status: "cancelled" });
    } else if (req.body.status === "processing") {
      // Giữ nguyên logic xử lý cho trạng thái processing
      const existingPointHistory = await PointHistory.findOne({
        orderId: order._id,
      });
      if (existingPointHistory) {
        await Order.findByIdAndUpdate(order._id, {
          status: req.body.status,
          ...(vnpTransactionDate && { vnpTransactionDate }),
        });
        return res.json(
          jsonGenerate(
            StatusCode.CONTINUE,
            "Đơn hàng này đã được tích điểm, chỉ cập nhật trạng thái"
          )
        );
      }

      const { total, AccountId } = order;
      const loyaltyProgram = await LoyaltyProgram.findOne({ AccountId });

      let points = 0;
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

      await Order.findByIdAndUpdate(order._id, {
        status: req.body.status,
        ...(vnpTransactionDate && { vnpTransactionDate }),
      });
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
      }
    } else {
      // Các trạng thái khác chỉ cần cập nhật
      await Order.findByIdAndUpdate(order._id, {
        status: req.body.status,
        ...(vnpTransactionDate && { vnpTransactionDate }),
      });
    }

    return res.json(
      jsonGenerate(StatusCode.OK, "Cập nhật trạng thái đơn hàng thành công")
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const checkPurchase = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const orders = await Order.find({
      AccountId: userId,
      status: "completed",
    });

    console.log(orders);

    for (const order of orders) {
      const orderDetail = await OrderDetail.findOne({ orderId: order._id });
      if (
        orderDetail &&
        orderDetail.items.some(
          (item) => item.productId.toString() === productId
        )
      ) {
        return res.json({ hasPurchased: true });
      }
    }
    return res.json({ hasPurchased: false });
  } catch (error) {
    console.error("Error checking purchase:", error);
    return res.status(500).json({ message: "Internal server error" });
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
