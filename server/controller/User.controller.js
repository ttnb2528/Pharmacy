import asyncHandler from "../middleware/asyncHandler.js";
import Account from "../model/Account.model.js";
import Customer from "../model/Customer.model.js";
import { StatusCode } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";
import Joi from "joi";

export const getCustomers = asyncHandler(async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(jsonGenerate(StatusCode.OK, "Thành công", customers));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getCustomerById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy khách hàng")
      );
    }

    res.json(jsonGenerate(StatusCode.OK, "Thành công", customer));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const updateCustomer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = validate(req.body);
    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy khách hàng")
      );
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(
      jsonGenerate(StatusCode.OK, "Cập nhật thành công", updatedCustomer)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy khách hàng")
      );
    }

    await Account.deleteOne({ _id: customer.accountId });
    await Customer.findByIdAndDelete(id);

    res.json(jsonGenerate(StatusCode.OK, "Xóa thành công"));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Họ và tên"),
    gender: Joi.string().required().label("Giới tính"),
    date: Joi.date().required().label("Ngày sinh"),
    email: Joi.string().required().label("Email"),
    phone: Joi.string().required().label("Số điện thoại"),
    address: Joi.string().required().label("Địa chỉ"),
  })
    .messages({
      "string.empty": "{#label} không được để trống",
      "any.required": "{#label} là bắt buộc",
      "string.base": "{#label} phải là chuỗi ký tự",
      "date.base": "{#label} phải là ngày tháng",
    })
    .unknown(true);

  return schema.validate(data);
};
