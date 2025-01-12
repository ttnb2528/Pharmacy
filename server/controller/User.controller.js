import asyncHandler from "../middleware/asyncHandler.js";
import Account from "../model/Account.model.js";
import Customer from "../model/Customer.model.js";
import { StatusCode } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";
import Joi from "joi";
import cloudinary from "../config/cloudinary.js";

export const getCustomers = asyncHandler(async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(jsonGenerate(StatusCode.OK, "Thành công", customers));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getUserInfo = asyncHandler(async (req, res) => {
  const userData = await Account.findById(req.user._id);

  if (!userData) {
    return res.status(404).send("không tìm thấy thông tin người dùng");
  }

  const populatedUser = await Customer.findOne({
    accountId: req.user._id,
  }).populate("accountId");

  res.json(jsonGenerate(StatusCode.OK, "Thành công", populatedUser));
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

export const addProfileImage = async (req, res, next) => {
  console.log(req.body);
  const { avatar } = req.body;

  try {
    if (!avatar) {
      return res.status(400).send("Please provide an image");
    }

    const updateUser = await Customer.findOneAndUpdate(
      {
        accountId: req.user._id,
      },
      { avatar: avatar },
      { new: true, runValidators: true }
    );

    // return res.status(200).json({
    //   image: updateUser.image,
    // });

    return res.json(
      jsonGenerate(StatusCode.OK, "Cập nhật ảnh thành công", updateUser.avatar)
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const user = await Customer.findOne({ accountId: req.user._id });

    if (!user) {
      return res.json(
        jsonGenerate(
          StatusCode.NOT_FOUND,
          "Không tìm thấy thông tin người dùng"
        )
      );
    }

    let parts = user.avatar.split("/");
    let fileName = parts[parts.length - 1].split(".")[0]; // Loại bỏ phần mở rộng .jpg
    let folder = parts[parts.length - 2];

    let public_id = folder + "/" + fileName;
    console.log(public_id);

    const response = await cloudinary.uploader.destroy(public_id);

    console.log("Delete result:", response);

    user.avatar = null;
    await user.save();

    return res.json(jsonGenerate(StatusCode.OK, "Xoá ảnh thành công"));
  } catch (error) {
    console.log(error);
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
};

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
