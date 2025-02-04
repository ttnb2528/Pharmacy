import Brand from "../model/Brand.model.js";
import Medicine from "../model/Medicine.model.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Joi from "joi";
import { generateID } from "../utils/generateID.js";

export const addBrand = asyncHandler(async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }

    const brandExits = await Brand.findOne({ name: req.body.name });

    if (brandExits) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Thương hiệu đã tồn tại")
      );
    }

    let id = await generateID(Brand);

    const newBrand = new Brand({
      id,
      ...req.body,
    });

    const brand = await newBrand.save();

    res.json(
      jsonGenerate(StatusCode.CREATED, "Thêm thương hiệu thành công", brand)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const getBrands = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find();

    res.json(
      jsonGenerate(
        StatusCode.OK,
        "Lấy danh sách thương hiệu thành công",
        brands
      )
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const getBrand = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy thương hiệu")
      );
    }

    res.json(jsonGenerate(StatusCode.OK, "Lấy thương hiệu thành công", brand));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const updateBrand = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const brand = await Brand.findById(id);

    if (!brand) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy thương hiệu")
      );
    }
    const { error } = validate(req.body);

    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }

    const brandExits = await Brand.findOne({
      name: req.body.name,
      _id: { $ne: id },
    });

    if (brandExits) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Thương hiệu đã tồn tại")
      );
    }

    const newBrand = await Brand.findByIdAndUpdate(id, req.body);

    res.json(
      jsonGenerate(StatusCode.OK, "Cập nhật thương hiệu thành công", newBrand)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const deleteBrand = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy thương hiệu")
      );
    }

    const medicineExits = await Medicine.findOne({ brandId: req.params.id });

    console.log(medicineExits);

    if (medicineExits) {
      return res.json(
        jsonGenerate(
          StatusCode.BAD_REQUEST,
          "Không thể xóa thương hiệu này vì có thuốc đang sử dụng"
        )
      );
    }

    await Brand.findByIdAndDelete(req.params.id);

    res.json(jsonGenerate(StatusCode.OK, "Xóa thương hiệu thành công"));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
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
