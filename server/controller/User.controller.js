import asyncHandler from "../middleware/asyncHandler.js";
import Account from "../model/Account.model.js";
import Customer from "../model/Customer.model.js";
import { StatusCode } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";
import Joi from "joi";
import cloudinary from "../config/cloudinary.js";
import { generateID } from "../utils/generateID.js";

export const createCustomer = asyncHandler(async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.json(jsonGenerate(StatusCode.BAD_REQUEST, error.message));
    }

    const phoneExits = await Customer.findOne({ phone: req.body.phone });

    if (phoneExits) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Số điện thoại đã sử dụng")
      );
    }

    let id = await generateID(Customer);

    const newCustomer = new Customer({
      id,
      ...req.body,
    });

    const customer = await newCustomer.save();

    const populatedCustomer = await Customer.findOne({
      _id: customer._id,
    }).populate("accountId");

    res.json(
      jsonGenerate(
        StatusCode.CREATED,
        "Tạo khách hàng thành công",
        populatedCustomer
      )
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getCustomers = asyncHandler(async (req, res) => {
  try {
    const customers = await Customer.find().populate("accountId");
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
  }).populate({ path: "accountId", populate: { path: "loyaltyProgramId" } });

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

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy khách hàng")
      );
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("accountId");

    res.json(
      jsonGenerate(StatusCode.OK, "Cập nhật thành công", updatedCustomer)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const updatePassword = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const account = await Account.findById(id);

    if (!account) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy tài khoản")
      );
    }

    account.password = password;
    await account.save();

    res.json(jsonGenerate(StatusCode.OK, "Cập nhật mật khẩu thành công"));
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

    const haveAccount = await Account.findOne({ _id: customer.accountId });

    if (!haveAccount) {
      await Customer.findByIdAndDelete(id);
      return res.json(jsonGenerate(StatusCode.OK, "Xóa thành công"));
    } else {
      await Account.deleteOne({ _id: customer.accountId });
      await Customer.findByIdAndDelete(id);
      return res.json(jsonGenerate(StatusCode.OK, "Xóa thành công"));
    }
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const addToCart = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userData = await Account.findOne({ _id: req.user._id });

    if (!userData) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy khách hàng")
      );
    }

    userData.cartData[productId] += quantity;
    await Account.findOneAndUpdate({ _id: req.user._id }, userData);

    res.json(jsonGenerate(StatusCode.OK, "Thêm vào giỏ hàng thành công"));
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const removeFromCart = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userData = await Account.findOne({ _id: req.user._id });

    if (!userData) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy khách hàng")
      );
    }

    userData.cartData[productId] -= quantity;
    await Account.findOneAndUpdate({ _id: req.user._id }, userData);

    res.json(jsonGenerate(StatusCode.OK, "Xóa sản phẩm thành công"));
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const removeProductFromCart = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const userData = await Account.findOne({ _id: req.user._id });

    if (!userData) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy khách hàng")
      );
    }

    userData.cartData[productId] = 0;
    await Account.findOneAndUpdate({ _id: req.user._id }, userData);

    res.json(jsonGenerate(StatusCode.OK, "Xóa sản phẩm thành công"));
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const updateCart = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const userData = await Account.findOne({ _id: req.user._id });

    if (!userData) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy khách hàng")
      );
    }

    userData.cartData[productId] = quantity;
    await Account.findOneAndUpdate({ _id: req.user._id }, userData);

    res.json(jsonGenerate(StatusCode.OK, "Cập nhật giỏ hàng thành công"));
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const clearCart = asyncHandler(async (req, res) => {
  try {
    const userData = await Account.findOne({ _id: req.user._id });

    if (!userData) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy khách hàng")
      );
    }

    for (const key in userData.cartData) {
      userData.cartData[key] = 0;
    }

    await Account.findOneAndUpdate({ _id: req.user._id }, userData);

    res.json(jsonGenerate(StatusCode.OK, "Xóa giỏ hàng thành công"));
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Họ và tên"),
    // gender: Joi.string().required().label("Giới tính"),
    // date: Joi.date().required().label("Ngày sinh"),
    // email: Joi.string().required().label("Email"),
    phone: Joi.string().required().label("Số điện thoại"),
    // address: Joi.string().required().label("Địa chỉ"),
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
