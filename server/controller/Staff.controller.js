import Joi from "joi";
import asyncHandler from "../middleware/asyncHandler.js";
import Staff from "../model/Staff.model.js";
import { StatusCode } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";

export const createStaff = asyncHandler(async (req, res) => {
  try {
    // const { username, password, name, phone, address, isAdmin } = req.body;
    const { isAdmin, username } = req.body;

    if (isAdmin === true) {
      // if (!username || !password) {
      //   return res.json(
      //     jsonGenerate(
      //       StatusCode.BAD_REQUEST,
      //       "Vui lòng nhập username và password"
      //     )
      //   );
      // }

      const { error } = validate1(req.body);

      if (error) {
        return res.json(
          jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
        );
      }

      const adminExist = await Staff.findOne({ isAdmin: true, username });

      if (adminExist) {
        return res.json(
          jsonGenerate(StatusCode.BAD_REQUEST, "Admin đã tồn tại")
        );
      }

      const admin = await Staff.create({
        name: "Admin",
        ...req.body,
        isAdmin: true, // Đặt isAdmin = true
      });

      return res.json(
        jsonGenerate(StatusCode.CREATED, "Tạo admin thành công", admin)
      );
    } else if (isAdmin === false) {
      const { error } = validate(req.body);

      if (error) {
        return res.json(
          jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
        );
      }

      const staffExist = await Staff.findOne({ username });

      if (staffExist) {
        return res.json(
          jsonGenerate(StatusCode.BAD_REQUEST, "Username đã tồn tại")
        );
      }

      const staff = await Staff.create({
        ...req.body,
      });

      return res.json(
        jsonGenerate(StatusCode.CREATED, "Tạo nhân viên thành công", staff)
      );
    } else {
      return res.json(jsonGenerate(StatusCode.BAD_REQUEST, "Chưa chọn role"));
    }
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getStaffs = asyncHandler(async (req, res) => {
  try {
    const staffs = await Staff.find();

    res.json(
      jsonGenerate(StatusCode.OK, "Lấy danh sách nhân viên thành công", staffs)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getStaff = asyncHandler(async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy nhân viên")
      );
    }

    res.json(jsonGenerate(StatusCode.OK, "Lấy nhân viên thành công", staff));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getCurrentStaff = asyncHandler(async (req, res) => {
  try {
    const staff = await Staff.findById(req.user._id);

    if (!staff) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy thông tin")
      );
    }

    res.json(jsonGenerate(StatusCode.OK, "Lấy thành công", staff));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const updateStaff = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const staff = await Staff.findById(id);

    if (!staff) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy nhân viên")
      );
    }

    // const { error } = validate(req.body);

    // if (error) {
    //   return res.json(
    //     jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
    //   );
    // }

    const staffExits = await Staff.findOne({
      username: req.body.username,
      _id: { $ne: id },
    });

    if (staffExits) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Username đã tồn tại")
      );
    }

    const newStaff = await Staff.findByIdAndUpdate(id, req.body);

    res.json(
      jsonGenerate(StatusCode.OK, "Cập nhật nhân viên thành công", newStaff)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const updatePassword = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    const { password } = req.body;

    const staff = await Staff.findById(id);

    if (!staff) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm nhân viên")
      );
    }

    staff.password = password;
    await staff.save();

    res.json(jsonGenerate(StatusCode.OK, "Cập nhật mật khẩu thành công"));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const deleteStaff = asyncHandler(async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy nhân viên")
      );
    }

    await Staff.findByIdAndDelete(req.params.id);

    res.json(jsonGenerate(StatusCode.OK, "Xóa nhân viên thành công"));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Tên nhân viên"),
    // gender: Joi.string().required().label("Giới tính"),
    // date: Joi.date().required().label("Ngày sinh"),
    phone: Joi.string().required().label("Số điện thoại"),
    address: Joi.string().required().label("Địa chỉ"),
    workDate: Joi.string().required().label("Ngày vào làm"),
    username: Joi.string().required().label("Tên đăng nhập"),
    password: Joi.string().required().label("Mật khẩu"),
  })
    .messages({
      "string.empty": "{#label} không được để trống",
      "any.required": "{#label} là bắt buộc",
      "string.base": "{#label} phải là chuỗi ký tự",
    })
    .unknown(true);

  return schema.validate(data);
};

const validate1 = (data) => {
  const AdminSchema = Joi.object({
    username: Joi.string().required().label("Tên đăng nhập"),
    password: Joi.string().required().label("Mật khẩu"),
  })
    .messages({
      "string.empty": "{#label} không được để trống",
      "any.required": "{#label} là bắt buộc",
      "string.base": "{#label} phải là chuỗi ký tự",
    })
    .unknown(true);

  return AdminSchema.validate(data);
};
