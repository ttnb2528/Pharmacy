import Account from "../model/Account.model.js";
import Customer from "../model/Customer.model.js";
import bcryptjs from "bcryptjs";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import generateToken from "../utils/createToken.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Staff from "../model/Staff.model.js";

export const signup = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Vui lòng nhập đầy đủ thông tin")
      );
    }

    const existingUser = await Account.findOne({ email });

    if (existingUser) {
      return res.json(jsonGenerate(StatusCode.BAD_REQUEST, "Email đã tồn tại"));
    }

    const user = await Account.create({ email, password });
    await Customer.create({ accountId: user._id });

    const populatedUser = await Customer.findOne({
      accountId: user._id,
    }).populate("accountId");

    generateToken(res, user._id);

    return res.json(
      jsonGenerate(StatusCode.CREATED, "Đăng ký thành công", populatedUser)
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Vui lòng nhập đầy đủ thông tin")
      );
    }

    const userExist = await Account.findOne({ email });

    if (!userExist) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Email không tồn tại")
      );
    }

    const isPasswordCorrect = await bcryptjs.compare(
      password,
      userExist.password
    );

    if (isPasswordCorrect) {
      const populatedUser = await Customer.findOne({
        accountId: userExist._id,
      }).populate("accountId");

      const user = populatedUser.toObject();
      delete user.accountId.password;

      generateToken(res, userExist._id);

      res.json(jsonGenerate(StatusCode.OK, "Đăng nhập thành công", user));

      return;
    } else {
      res.json(jsonGenerate(StatusCode.BAD_REQUEST, "Mật khẩu không đúng"));
    }
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Vui lòng nhập đầy đủ thông tin")
      );
    }

    const userExist = await Staff.findOne({ username });

    if (!userExist) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Username không tồn tại")
      );
    }

    const isPasswordCorrect = await bcryptjs.compare(
      password,
      userExist.password
    );

    if (isPasswordCorrect) {
      generateToken(res, userExist._id);

      delete userExist.password;
      res.json(jsonGenerate(StatusCode.OK, "Đăng nhập thành công", userExist));

      return;
    } else {
      res.json(jsonGenerate(StatusCode.BAD_REQUEST, "Mật khẩu không đúng"));
    }
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const logout = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.json(jsonGenerate(StatusCode.OK, "Đăng xuất thành công"));
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});
