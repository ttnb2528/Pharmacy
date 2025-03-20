import Coupon from "../model/Coupon.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import Joi from "joi";
import { generateID } from "../utils/generateID.js";
import CouponUsage from "../model/CouponUsage.model.js";

export const createCoupon = asyncHandler(async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }

    if (req.body.discount_value <= 0) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Giá trị giảm giá phải lớn hơn 0")
      );
    }

    if (req.body.start_date > req.body.end_date) {
      return res.json(
        jsonGenerate(
          StatusCode.BAD_REQUEST,
          "Ngày bắt đầu phải nhỏ hơn ngày kết thúc"
        )
      );
    }

    const couponExits = await Coupon.findOne({
      coupon_code: req.body.coupon_code,
    });

    if (couponExits) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Mã giảm giá đã tồn tại")
      );
    }

    let id = await generateID(Coupon);

    const newCoupon = new Coupon({
      id,
      ...req.body,
    });

    const coupon = await newCoupon.save();

    return res.json(
      jsonGenerate(StatusCode.CREATED, "Tạo mã giảm giá thành công", coupon)
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getCoupons = asyncHandler(async (req, res) => {
  try {
    const accountId = req.user._id;

    // Lấy tất cả coupon còn active
    const coupons = await Coupon.find({
      status: "active",
      end_date: { $gt: new Date() },
      quantity: { $gt: 0 },
    });

    // Lấy lịch sử sử dụng coupon của user
    const couponUsages = await CouponUsage.find({ accountId });

    // Thêm thông tin về khả năng sử dụng cho mỗi coupon
    const couponsWithUsage = await Promise.all(
      coupons.map(async (coupon) => {
        const usage = couponUsages.find((u) => u.couponId.equals(coupon._id));
        const usageCount = usage ? usage.usageCount : 0;

        return {
          ...coupon.toObject(),
          usageCount,
          canUse: usageCount < coupon.maximum_uses,
        };
      })
    );

    res.json(
      jsonGenerate(
        StatusCode.OK,
        "Lấy danh sách coupon thành công",
        couponsWithUsage
      )
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getCouponsAdmin = asyncHandler(async (req, res) => {
  try {
    const currentDate = new Date();
    const today = new Date(currentDate.setHours(0, 0, 0, 0)); // Ngày hôm nay, 00:00:00

    let coupons = await Coupon.find();

    if (!coupons || coupons.length === 0) {
      return res.json(
        jsonGenerate(StatusCode.OK, "Không có coupon nào trong hệ thống", [])
      );
    }

    // Cập nhật trạng thái dựa trên end_date và quantity
    const updatedCoupons = await Promise.all(
      coupons.map(async (coupon) => {
        const endDate = new Date(coupon.end_date);
        const endDateOnly = new Date(endDate.setHours(0, 0, 0, 0));
        let status = coupon.status;

        if (endDateOnly < today) {
          status = "expired";
        } else if (coupon.quantity <= 0) {
          status = "inactive";
        } else {
          status = "active";
        }

        if (status !== coupon.status) {
          const updatedCoupon = await Coupon.findByIdAndUpdate(
            coupon._id,
            { status },
            { new: true }
          );
          return updatedCoupon;
        }
        return coupon;
      })
    );

    res.json(
      jsonGenerate(
        StatusCode.OK,
        "Lấy danh sách coupon thành công",
        updatedCoupons
      )
    );
  } catch (error) {
    console.error("Lỗi trong getCouponsAdmin:", error);
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy mã giảm giá")
      );
    }

    return res.json(
      jsonGenerate(StatusCode.OK, "Lấy mã giảm giá thành công", coupon)
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const updateCoupon = asyncHandler(async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }

    if (req.body.start_date > req.body.end_date) {
      return res.json(
        jsonGenerate(
          StatusCode.BAD_REQUEST,
          "Ngày bắt đầu phải nhỏ hơn ngày kết thúc"
        )
      );
    }

    const id = req.params.id;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy mã giảm giá")
      );
    }

    // Kiểm tra nếu mã đã hết hạn (trạng thái "expired")
    if (coupon.status === "expired") {
      return res.json(
        jsonGenerate(
          StatusCode.BAD_REQUEST,
          "Không thể sửa mã giảm giá đã hết hạn"
        )
      );
    }

    if (req.body.discount_value <= 0) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Giá trị giảm giá phải lớn hơn 0")
      );
    }

    if (req.body.coupon_code !== coupon.coupon_code) {
      const couponExists = await Coupon.findOne({
        coupon_code: req.body.coupon_code,
      });
      if (couponExists) {
        return res.json(
          jsonGenerate(StatusCode.BAD_REQUEST, "Mã giảm giá đã tồn tại")
        );
      }
    }

    // Chuẩn hóa ngày để chỉ so sánh phần ngày
    const currentDate = new Date();
    const today = new Date(currentDate.setHours(0, 0, 0, 0)); // Ngày hôm nay, 00:00:00
    const endDateInput = new Date(req.body.end_date);

    // Kiểm tra nếu end_date không hợp lệ
    if (isNaN(endDateInput.getTime())) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Ngày kết thúc không hợp lệ")
      );
    }

    const endDateOnly = new Date(endDateInput.setHours(0, 0, 0, 0)); // end_date, 00:00:00

    // Debug: Ghi log để kiểm tra giá trị
    // console.log("Today:", today);
    // console.log("End Date:", endDateOnly);
    // console.log("Is endDateOnly < today?", endDateOnly < today);

    // Cập nhật trạng thái: chỉ "expired" nếu end_date nhỏ hơn ngày hôm nay
    const updatedStatus = endDateOnly < today ? "expired" : "active";

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { ...req.body, status: updatedStatus }, // Cập nhật trạng thái
      { new: true, runValidators: true }
    );

    return res.json(
      jsonGenerate(
        StatusCode.OK,
        "Cập nhật mã giảm giá thành công",
        updatedCoupon
      )
    );
  } catch (error) {
    console.log("Lỗi trong updateCoupon:", error);
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy mã giảm giá")
      );
    }

    await Coupon.findByIdAndDelete(id);

    return res.json(jsonGenerate(StatusCode.OK, "Xóa mã giảm giá thành công"));
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getAvailableCoupons = asyncHandler(async (req, res) => {
  try {
    const accountId = req.user._id;

    // Lấy tất cả coupon còn active
    const coupons = await Coupon.find({
      status: "active",
      end_date: { $gt: new Date() },
      quantity: { $gt: 0 },
    });

    // Lấy lịch sử sử dụng coupon của user
    const couponUsages = await CouponUsage.find({ accountId });

    // Lọc các coupon có thể sử dụng
    const availableCoupons = coupons
      .map((coupon) => {
        const usage = couponUsages.find((u) => u.couponId.equals(coupon._id));
        const usageCount = usage ? usage.usageCount : 0;
        const canUse = usageCount < coupon.maximum_uses;

        return {
          ...coupon.toObject(),
          usageCount,
          canUse,
        };
      })
      .filter((coupon) => coupon.canUse);

    res.json(
      jsonGenerate(
        StatusCode.OK,
        "Lấy danh sách coupon thành công",
        availableCoupons
      )
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

const validate = (data) => {
  const schema = Joi.object({
    coupon_code: Joi.string().required().label("Mã giảm giá"),
    description: Joi.string().required().label("Mô tả"),
    discount_type: Joi.string()
      .valid("percentage", "fixed_amount")
      .required()
      .label("Loại giảm giá"),
    discount_value: Joi.number().required().label("Giá trị giảm giá"),
    minimum_order_value: Joi.number().label("Giá trị đơn hàng tối thiểu"),
    quantity: Joi.number().label("Số lượng"),
    maximum_uses: Joi.number().label("Số lần sử dụng tối đa"),
    start_date: Joi.date().label("Ngày bắt đầu"),
    end_date: Joi.date().label("Ngày kết thúc"),
  })
    .messages({
      "string.empty": "{#label} không được để trống",
      "any.required": "{#label} là bắt buộc",
      "string.base": "{#label} phải là chuỗi ký tự",
      "number.base": "{#label} phải là số",
      "date.base": "{#label} phải là ngày tháng",
    })
    .unknown(true);

  return schema.validate(data);
};
