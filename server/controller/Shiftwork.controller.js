import ShiftWork from "../model/shiftwork.model.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Joi from "joi";
import { generateID } from "../utils/generateID.js";

export const addShiftWork = asyncHandler(async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }

    const shiftWorkExits = await ShiftWork.findOne({ name: req.body.name });

    if (shiftWorkExits) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Ca làm việc đã tồn tại")
      );
    }

    let id = await generateID(ShiftWork);

    const newShiftWork = new ShiftWork({
      id,
      ...req.body,
    });

    const shiftWork = await newShiftWork.save();

    res.json(
      jsonGenerate(StatusCode.CREATED, "Thêm ca làm việc thành công", shiftWork)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const getShiftWorks = asyncHandler(async (req, res) => {
  try {
    const shiftWorks = await ShiftWork.find();

    res.json(
      jsonGenerate(
        StatusCode.OK,
        "Lấy danh sách ca làm việc thành công",
        shiftWorks
      )
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const getShiftWork = asyncHandler(async (req, res) => {
  try {
    const shiftWork = await ShiftWork.findById(req.params.id);

    if (!shiftWork) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy ca làm việc")
      );
    }

    res.json(
      jsonGenerate(
        StatusCode.OK,
        "Lấy thông tin ca làm việc thành công",
        shiftWork
      )
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const updateShiftWork = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const shiftWork = await ShiftWork.findById(id);

    if (!shiftWork) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy ca làm việc")
      );
    }

    const { error } = validate(req.body);

    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }

    const shiftWorkExits = await ShiftWork.findOne({
      name: req.body.name,
      _id: { $ne: id },
    });

    if (shiftWorkExits) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Ca làm việc đã tồn tại")
      );
    }

    const updatedShiftWork = await ShiftWork.findByIdAndUpdate(id, {
      ...req.body,
    });

    res.json(
      jsonGenerate(
        StatusCode.OK,
        "Cập nhật thông tin ca làm việc thành công",
        updatedShiftWork
      )
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const deleteShiftWork = asyncHandler(async (req, res) => {
  try {
    const shiftWork = await ShiftWork.findById(req.params.id);

    if (!shiftWork) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy ca làm việc")
      );
    }

    await ShiftWork.findByIdAndDelete(req.params.id);

    res.json(jsonGenerate(StatusCode.OK, "Xóa ca làm việc thành công"));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});
const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Tên ca làm việc"),
    hours: Joi.number().required().label("Số giờ"),
  })
    .messages({
      "string.empty": "{#label} không được để trống",
      "number.base": "{#label} phải là số",
      "any.required": "{#label} là bắt buộc",
      "string.base": "{#label} phải là chuỗi ký tự",
    })
    .unknown(true);

  return schema.validate(data);
};
