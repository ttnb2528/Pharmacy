import Category from "../model/Category.model.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Joi from "joi";
import { generateID } from "../utils/generateID.js";

export const addCategory = asyncHandler(async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }

    const categoryExits = await Category.findOne({ name: req.body.name });

    if (categoryExits) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Danh mục đã tồn tại")
      );
    }

    let id = await generateID(Category);

    const newCategory = new Category({
      id,
      ...req.body,
    });

    const category = await newCategory.save();

    res.json(
      jsonGenerate(StatusCode.CREATED, "Thêm danh mục thành công", category)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find();

    res.json(
      jsonGenerate(
        StatusCode.OK,
        "Lấy danh sách danh mục thành công",
        categories
      )
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const getCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy danh mục")
      );
    }

    res.json(jsonGenerate(StatusCode.OK, "Lấy danh mục thành công", category));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const updateCategory = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);

    if (!category) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy danh mục")
      );
    }
    const { error } = validate(req.body);

    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }

    const categoryExits = await Category.findOne({ name: req.body.name });

    if (categoryExits) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Danh mục đã tồn tại")
      );
    }

    await Category.findByIdAndUpdate(id, req.body);

    res.json(jsonGenerate(StatusCode.OK, "Cập nhật danh mục thành công"));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy danh mục")
      );
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json(jsonGenerate(StatusCode.OK, "Xóa danh mục thành công"));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Tên danh mục"),
  })
    .messages({
      "string.empty": "{#label} không được để trống",
      "any.required": "{#label} là bắt buộc",
      "string.base": "{#label} phải là chuỗi ký tự",
    })
    .unknown(true);

  return schema.validate(data);
};
