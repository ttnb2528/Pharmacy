import Supplier from "../model/Supplier.model.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { generateID } from "../utils/generateID.js";
import Joi from "joi";

export const addSupplier = asyncHandler(async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }
    const supplierExits = await Supplier.findOne({ name: req.body.name });

    if (supplierExits) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Nhà cung cấp đã tồn tại")
      );
    }

    let id = await generateID(Supplier);

    const newSupplier = new Supplier({
      id,
      ...req.body,
    });

    const supplier = await newSupplier.save();

    res.json(
      jsonGenerate(StatusCode.CREATED, "Thêm nhà cung cấp thành công", supplier)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const getSuppliers = asyncHandler(async (req, res) => {
  try {
    const suppliers = await Supplier.find();

    res.json(
      jsonGenerate(
        StatusCode.OK,
        "Lấy danh sách nhà cung cấp thành công",
        suppliers
      )
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const getSupplier = asyncHandler(async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy nhà cung cấp")
      );
    }

    res.json(
      jsonGenerate(
        StatusCode.OK,
        "Lấy thông tin nhà cung cấp thành công",
        supplier
      )
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const updateSupplier = asyncHandler(async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }

    const id = req.params.id;
    const supplier = await Supplier.findById(id);

    if (!supplier) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy nhà cung cấp")
      );
    }

    const supplierExits = await Supplier.findOne({
      name: req.body.name,
      _id: { $ne: id },
    });

    if (supplierExits) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Nhà cung cấp đã tồn tại")
      );
    }

    await Supplier.findByIdAndUpdate(id, req.body);

    res.json(
      jsonGenerate(StatusCode.OK, "Cập nhật thông tin nhà cung cấp thành công")
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

export const deleteSupplier = asyncHandler(async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy nhà cung cấp")
      );
    }

    await Supplier.findByIdAndDelete(req.params.id);

    res.json(jsonGenerate(StatusCode.OK, "Xóa nhà cung cấp thành công"));
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server", error));
  }
});

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Tên nhà cung cấp"),
    address: Joi.string().required().label("Địa chỉ"),
    phone: Joi.date().required().label("Số điện thoại"),
  })
    .messages({
      "string.empty": "{#label} không được để trống",
      "any.required": "{#label} là bắt buộc",
      "string.base": "{#label} phải là chuỗi ký tự",
    })
    .unknown(true);

  return schema.validate(data);
};
