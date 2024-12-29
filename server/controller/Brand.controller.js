import Brand from "../model/Brand.model.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Joi from "joi";
import { generateID } from "../utils/generateID.js";

export const addBrand = asyncHandler(async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res
      .status(StatusCode.BAD_REQUEST)
      .json(jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message));
  }

  const brandExits = await Brand.findOne({ name: req.body.name });

  if (brandExits) {
    return res
      .status(StatusCode.BAD_REQUEST)
      .json(jsonGenerate(StatusCode.BAD_REQUEST, "Thương hiệu đã tồn tại"));
  }

  let id = await generateID(Brand);

  const newBrand = new Brand({
    id,
    ...req.body,
  });

  const brand = await newBrand.save();

  res
    .status(StatusCode.CREATED)
    .json(
      jsonGenerate(StatusCode.CREATED, "Thêm thương hiệu thành công", brand)
    );
});

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Tên thương hiệu"),
  })
    .messages({
      "string.empty": "{#label} không được để trống",
      "any.required": "{#label} là bắt buộc",
      "string.base": "{#label} phải là chuỗi ký tự",
    })
    .unknown(true);

  return schema.validate(data);
};
