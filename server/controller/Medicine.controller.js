import Medicine from "../model/Medicine.model.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Joi from "joi";
import { generateID } from "../utils/generateID.js";

export const addMedicine = asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res
      .status(StatusCode.BAD_REQUEST)
      .json(jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message));
  }

  let id = await generateID(Medicine);

  const newMedicine = new Medicine({
    id: id,
    ...req.body,
  });

  const medicine = await newMedicine.save();
  res
    .status(StatusCode.CREATED)
    .json(jsonGenerate(StatusCode.CREATED, "Thêm thuốc thành công", medicine));
});

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Tên thuốc"),
    dosage: Joi.string().required().label("Liều lượng"),
    unit: Joi.string().required().label("Đơn vị"),
    instruction: Joi.string().required().label("Hướng dẫn sử dụng"),
    uses: Joi.string().required().label("Công dụng"),
    description: Joi.string().required().label("Mô tả"),
    packaging: Joi.string().required().label("Quy cách đóng gói"),
    effect: Joi.string().required().label("Tác dụng phụ"),
    isRx: Joi.boolean().required().label("Thuốc kê đơn"),
    drugUser: Joi.string().required().label("Đối tượng sử dụng"),
    categoryId: Joi.string().required().label("Danh mục"),
    brandId: Joi.string().required().label("Thương hiệu"),
  })
    .messages({
      "string.empty": "{#label} không được để trống",
      "any.required": "{#label} là bắt buộc",
      "string.base": "{#label} phải là chuỗi ký tự",
    })
    .unknown(true);

  return schema.validate(data);
};
