import Coupon from "../model/Coupon.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import Joi from "joi";
import { generateID } from "../utils/generateID.js";

export const createCoupon = asyncHandler(async (req, res) => {
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
    const coupons = await Coupon.find();

    return res.json(
      jsonGenerate(
        StatusCode.OK,
        "Lấy danh sách mã giảm giá thành công",
        coupons
      )
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
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

    if (req.body.coupon_code !== coupon.coupon_code) {
      const couponExits = await Coupon.findOne({
        coupon_code: req.body.coupon_code,
      });

      if (couponExits) {
        return res.json(
          jsonGenerate(StatusCode.BAD_REQUEST, "Mã giảm giá đã tồn tại")
        );
      }
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.json(
      jsonGenerate(
        StatusCode.OK,
        "Cập nhật mã giảm giá thành công",
        updatedCoupon
      )
    );
  } catch (error) {
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
  }).messages({
    "string.empty": "{#label} không được để trống",
    "any.required": "{#label} là bắt buộc",
    "string.base": "{#label} phải là chuỗi ký tự",
    "number.base": "{#label} phải là số",
    "date.base": "{#label} phải là ngày tháng",
  });

  return schema.validate(data);
};
