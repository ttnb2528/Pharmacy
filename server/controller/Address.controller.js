import Joi from "joi";
import asyncHandler from "../middleware/asyncHandler.js";
import Address from "../model/Address.model.js";
import { StatusCode } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";

export const addAddress = asyncHandler(async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }
    const newAddress = new Address({
      customerId: req.user._id,
      ...req.body,
    });
    const address = await newAddress.save();
    return res.json(
      jsonGenerate(StatusCode.CREATED, "Thêm địa chỉ thành công", address)
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const getAllAddress = asyncHandler(async (req, res) => {
  try {
    const addresses = await Address.find({ customerId: req.user._id });
    return res.json(
      jsonGenerate(StatusCode.OK, "Lấy danh sách địa chỉ thành công", addresses)
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const getAddress = asyncHandler(async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy địa chỉ")
      );
    }
    return res.json(
      jsonGenerate(StatusCode.OK, "Lấy địa chỉ thành công", address)
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const updateAddress = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const { error } = validate(req.body);

    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }
    const address = await Address.findById(id);

    if (!address) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy địa chỉ")
      );
    }

    await Address.findByIdAndUpdate(id, req.body);

    return res.json(
      jsonGenerate(StatusCode.OK, "Cập nhật địa chỉ thành công", address)
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const deleteAddress = asyncHandler(async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy địa chỉ")
      );
    }

    await Address.findByIdAndDelete(req.params.id);

    return res.json(
      jsonGenerate(StatusCode.OK, "Xóa địa chỉ thành công", address)
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Tên khách hàng"),
    phone: Joi.string().required().label("Số điện thoại"),
    provinceCity: Joi.string().required().label("Tỉnh/Thành phố"),
    district: Joi.string().required().label("Quận/Huyện"),
    ward: Joi.string().required().label("Phường/Xã"),
    otherDetails: Joi.string().required().label("Số nhà, tên đường"),
  })
    .messages({
      "string.empty": "{#label} không được để trống",
      "any.required": "{#label} là bắt buộc",
      "string.base": "{#label} phải là chuỗi ký tự",
    })
    .unknown(true);

  return schema.validate(data);
};
