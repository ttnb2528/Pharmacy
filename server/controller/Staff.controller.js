import asyncHandler from "../middleware/asyncHandler.js";
import Staff from "../model/Staff.model.js";
import { StatusCode } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";

export const createStaff = asyncHandler(async (req, res) => {
  try {
    const { username, password, name, phone, address, isAdmin } = req.body;

    if (isAdmin === true) {
      if (!username || !password) {
        return res.json(
          jsonGenerate(
            StatusCode.BAD_REQUEST,
            "Vui lòng nhập username và password"
          )
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
        username,
        password,
        isAdmin: true, // Đặt isAdmin = true
      });

      return res.json(
        jsonGenerate(StatusCode.CREATED, "Tạo admin thành công", admin)
      );
    } else if (isAdmin === false) {
      // Tạo nhân viên - yêu cầu các trường bắt buộc
      if (!username || !password || !name || !phone || !address) {
        return res.json(
          jsonGenerate(StatusCode.BAD_REQUEST, "Vui lòng nhập đầy đủ thông tin")
        );
      }

      const staffExist = await Staff.findOne({ username });

      if (staffExist) {
        return res.json(
          jsonGenerate(StatusCode.BAD_REQUEST, "Username đã tồn tại")
        );
      }

      const staff = await Staff.create(req.body);

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
