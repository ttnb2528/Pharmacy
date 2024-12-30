import Manufacture from "../model/Manufacture.model.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Joi from "joi";
import { generateID } from "../utils/generateID.js";

export const addManufacture = asyncHandler(async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }

    const manufactureExits = await Manufacture.findOne({ name: req.body.name });

    if (manufactureExits) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Nơi sản xuất đã tồn tại")
      );
    }

    let id = await generateID(Manufacture);

    const newManufacture = new Manufacture({
      id,
      ...req.body,
    });

    const manufacture = await newManufacture.save();

    res.json(
      jsonGenerate(
        StatusCode.CREATED,
        "Thêm nơi sản xuất thành công",
        manufacture
      )
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const getManufactures = asyncHandler(async (req, res) => {
  try {
    const manufactures = await Manufacture.find();

    res.json(
      jsonGenerate(
        StatusCode.OK,
        "Lấy danh sách nơi sản xuất thành công",
        manufactures
      )
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const getManufacture = asyncHandler(async (req, res) => {
  try {
    const manufacture = await Manufacture.findById(req.params.id);

    if (!manufacture) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy nơi sản xuất")
      );
    }

    res.json(
      jsonGenerate(StatusCode.OK, "Lấy nơi sản xuất thành công", manufacture)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const updateManufacture = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const manufacture = await Manufacture.findById(id);
    if (!manufacture) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy nơi sản xuất")
      );
    }
    const { error } = validate(req.body);
    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }
    await Manufacture.findByIdAndUpdate(id, req.body);
    res.json(jsonGenerate(StatusCode.OK, "Cập nhật nơi sản xuất thành công"));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const deleteManufacture = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const manufacture = await Manufacture.findById(id);
    if (!manufacture) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy nơi sản xuất")
      );
    }
    await Manufacture.findByIdAndDelete(id);

    res.json(jsonGenerate(StatusCode.OK, "Xóa nơi sản xuất thành công"));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Tên nơi sản xuất"),
  })
    .messages({
      "string.empty": "{#label} không được để trống",
      "any.required": "{#label} là bắt buộc",
      "string.base": "{#label} phải là chuỗi ký tự",
    })
    .unknown(true);

  return schema.validate(data);
};
