import Category from "../model/Category.model.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Joi from "joi";
import { generateID } from "../utils/generateID.js";

export const addCategory = asyncHandler(async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res
      .status(StatusCode.BAD_REQUEST)
      .json(jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message));
  }

  const categoryExits = await Category.findOne({ name: req.body.name });

  if (categoryExits) {
    return res
      .status(StatusCode.BAD_REQUEST)
      .json(jsonGenerate(StatusCode.BAD_REQUEST, "Danh mục đã tồn tại"));
  }

  let id = await generateID(Category);

  const newCategory = new Category({
    id,
    ...req.body,
  });

  const category = await newCategory.save();

  res
    .status(StatusCode.CREATED)
    .json(
      jsonGenerate(StatusCode.CREATED, "Thêm danh mục thành công", category)
    );
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
