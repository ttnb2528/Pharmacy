import Batch from "../model/Batch.model.js";
import Medicine from "../model/Medicine.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import Joi from "joi";
import { generateID } from "../utils/generateID.js";

export const createBatch = asyncHandler(async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }

    if (req.body.dateOfManufacture > req.body.expiryDate) {
      return res.json(
        jsonGenerate(
          StatusCode.BAD_REQUEST,
          "Ngày sản xuất phải nhỏ hơn hạn sử dụng"
        )
      );
    }

    const batchExits = await Batch.findOne({
      batchNumber: req.body.batchNumber,
    });

    if (batchExits) {
      return res.json(jsonGenerate(StatusCode.BAD_REQUEST, "Mã lô đã tồn tại"));
    }

    let id = await generateID(Batch);

    const newBatch = new Batch({
      id,
      ...req.body,
    });

    const batch = await newBatch.save();

    await Medicine.findByIdAndUpdate(
      req.body.MedicineId,
      { $inc: { quantityStock: req.body.quantity } }, // Increase quantityStock
      { new: true }
    );

    return res.json(
      jsonGenerate(StatusCode.CREATED, "Tạo lô thành công", batch)
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getBatches = asyncHandler(async (req, res) => {
  try {
    const batches = await Batch.find().populate(
      "SupplierId ManufactureId MedicineId"
    );

    return res.json(
      jsonGenerate(StatusCode.OK, "Lấy dữ liệu thành công", batches)
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getBatchById = asyncHandler(async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id).populate(
      "SupplierId ManufactureId MedicineId"
    );

    if (!batch) {
      return res.json(jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy lô"));
    }

    return res.json(
      jsonGenerate(StatusCode.OK, "Lấy dữ liệu thành công", batch)
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const updateBatch = asyncHandler(async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
      );
    }

    if (req.body.dateOfManufacture > req.body.expiryDate) {
      return res.json(
        jsonGenerate(
          StatusCode.BAD_REQUEST,
          "Ngày sản xuất phải nhỏ hơn hạn sử dụng"
        )
      );
    }

    const batchExits = await Batch.findOne({
      batchNumber: req.body.batchNumber,
    });

    if (batchExits && batchExits._id.toString() !== req.params.id) {
      return res.json(jsonGenerate(StatusCode.BAD_REQUEST, "Mã lô đã tồn tại"));
    }

    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.json(
      jsonGenerate(StatusCode.OK, "Cập nhật lô thành công", batch)
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const deleteBatch = asyncHandler(async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);

    if (!batch) {
      return res.json(jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy lô"));
    }

    return res.json(jsonGenerate(StatusCode.OK, "Xóa lô thành công"));
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

const validate = (data) => {
  const schema = Joi.object({
    batchNumber: Joi.string().required().label("Mã lô"),
    dateOfEntry: Joi.date().required().label("Ngày nhập"),
    dateOfManufacture: Joi.date().required().label("Ngày sản xuất"),
    expiryDate: Joi.date().required().label("Hạn sử dụng"),
    quantity: Joi.number().required().label("Số lượng"),
    price: Joi.number().required().label("Giá bán"),
    retailPrice: Joi.number().required().label("Giá bán lẻ"),
    SupplierId: Joi.string().required().label("Nhà cung cấp"),
    ManufactureId: Joi.string().required().label("Nhà sản xuất"),
    MedicineId: Joi.string().required().label("Thuốc"),
  });

  return schema.validate(data);
};
