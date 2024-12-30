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

export const getMedicines = asyncHandler(async (req, res) => {
  const medicines = await Medicine.find();
  res
    .status(StatusCode.OK)
    .json(
      jsonGenerate(StatusCode.OK, "Lấy danh sách thuốc thành công", medicines)
    );
});

export const getMedicine = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const medicine = await Medicine.findById(id);
  if (!medicine) {
    return res
      .status(StatusCode.NOT_FOUND)
      .json(jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy thuốc"));
  }
  res
    .status(StatusCode.OK)
    .json(
      jsonGenerate(StatusCode.OK, "Lấy thông tin thuốc thành công", medicine)
    );
});

export const deleteMedicine = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const medicine = await Medicine.findById(id);
  if (!medicine) {
    return res
      .status(StatusCode.NOT_FOUND)
      .json(jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy thuốc"));
  }

  await Medicine.findByIdAndDelete(id);
  res
    .status(StatusCode.OK)
    .json(jsonGenerate(StatusCode.OK, "Xóa thuốc thành công"));
});

export const updateMedicine = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const medicine = await Medicine.findById(id);

  if (!medicine) {
    return res
      .status(StatusCode.NOT_FOUND)
      .json(jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy thuốc"));
  }

  const { error } = validate(req.body);

  if (error) {
    return res
      .status(StatusCode.BAD_REQUEST)
      .json(jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message));
  }

  const medicineExist = await Medicine.findOne({
    name: req.body.name,
    _id: { $ne: id },
  });

  if (medicineExist) {
    return res
      .status(StatusCode.BAD_REQUEST)
      .json(jsonGenerate(StatusCode.BAD_REQUEST, "Tên thuốc đã tồn tại"));
  }

  await Medicine.findByIdAndUpdate(id, req.body);

  res
    .status(StatusCode.OK)
    .json(jsonGenerate(StatusCode.OK, "Cập nhật thuốc thành công"));
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
