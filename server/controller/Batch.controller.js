import Batch from "../model/Batch.model.js";
import Medicine from "../model/Medicine.model.js";
import Supplier from "../model/Supplier.model.js";
import Manufacture from "../model/Manufacture.model.js";
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

    const { quantity, price, retailPrice } = req.body;

    if (quantity <= 0) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Số lượng phải lớn hơn 0")
      );
    }

    if (price <= 0) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Giá bán phải lớn hơn 0")
      );
    }

    if (retailPrice <= 0) {
      return res.json(
        jsonGenerate(StatusCode.BAD_REQUEST, "Giá bán lẻ phải lớn hơn 0")
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

export const getBatchesForMedicine = asyncHandler(async (req, res) => {
  try {
    const batches = await Batch.find({ MedicineId: req.params.id }).populate(
      "SupplierId ManufactureId MedicineId"
    );

    return res.json(
      jsonGenerate(StatusCode.OK, "Lấy dữ liệu thành công", batches)
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getBatchesForStatistics = asyncHandler(async (req, res) => {
  try {
    const { from, to } = req.query;

    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    const batches = await Batch.find({
      createdAt: {
        $gte: fromDate,
        $lte: toDate,
      },
    }).populate("MedicineId");

    return res.json(
      jsonGenerate(StatusCode.OK, "Lấy dữ liệu thành công", batches)
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const bulkImportBatches = asyncHandler(async (req, res) => {
  const { batches } = req.body;

  if (!batches || !Array.isArray(batches) || batches.length === 0) {
    return res.json(
      jsonGenerate(StatusCode.BAD_REQUEST, "Dữ liệu không hợp lệ")
    );
  }

  const newBatches = [];
  const errors = [];

  for (const batch of batches) {
    // Ánh xạ từ tên cột tiếng Việt sang trường trong schema
    const mappedBatch = {
      medicineName: batch["Tên thuốc"],
      batchNumber: batch["Mã lô"],
      dateOfEntry: batch["Ngày nhập"],
      dateOfManufacture: batch["Ngày sản xuất"],
      expiryDate: batch["Hạn sử dụng"],
      quantity: Number(batch["Số lượng"]),
      price: Number(batch["Giá bán sỉ"]),
      retailPrice: Number(batch["Giá bán lẻ"]),
      supplierName: batch["Tên nhà cung cấp"],
      country: batch["Nước sản xuất"],
      manufactureName: batch["Tên nơi sản xuất"],
    };

    // Kiểm tra dữ liệu bắt buộc
    if (!mappedBatch.medicineName || !mappedBatch.batchNumber) {
      errors.push(`Thiếu "Tên thuốc" hoặc "Mã lô" trong dòng dữ liệu`);
      continue;
    }

    // Tìm hoặc tạo MedicineId từ medicineName
    const medicine = await Medicine.findOne({ name: mappedBatch.medicineName });
    if (!medicine) {
      errors.push(`Không tìm thấy thuốc "${mappedBatch.medicineName}"`);
      continue;
    }
    const medicineId = medicine._id;

    // Tìm hoặc tạo SupplierId từ supplierName
    let supplierId;
    if (mappedBatch.supplierName) {
      let supplier = await Supplier.findOne({ name: mappedBatch.supplierName });
      if (!supplier) {
        // Tạo mới nhà cung cấp nếu không tìm thấy
        let id = await generateID(Supplier);

        supplier = new Supplier({ id, name: mappedBatch.supplierName });
        await supplier.save();
        console.log(`Đã tạo mới nhà cung cấp: ${mappedBatch.supplierName}`);
      }
      supplierId = supplier._id;
    } else {
      errors.push(`Thiếu "Tên nhà cung cấp" cho "${mappedBatch.medicineName}"`);
      continue;
    }

    // Tìm hoặc tạo ManufactureId từ manufactureName
    let manufactureId;
    if (mappedBatch.manufactureName) {
      let manufacture = await Manufacture.findOne({
        name: mappedBatch.manufactureName,
      });
      if (!manufacture) {
        // Tạo mới nơi sản xuất nếu không tìm thấy
        let id = await generateID(Manufacture);
        manufacture = new Manufacture({
          id,
          name: mappedBatch.manufactureName,
          country: mappedBatch.country
        });
        await manufacture.save();
        console.log(`Đã tạo mới nơi sản xuất: ${mappedBatch.manufactureName}`);
      }
      manufactureId = manufacture._id;
    } else {
      errors.push(`Thiếu "Tên nơi sản xuất" cho "${mappedBatch.medicineName}"`);
      continue;
    }

    let id = await generateID(Batch);
    const newBatch = new Batch({
      id,
      MedicineId: medicineId,
      batchNumber: mappedBatch.batchNumber,
      dateOfEntry: mappedBatch.dateOfEntry,
      dateOfManufacture: mappedBatch.dateOfManufacture,
      expiryDate: mappedBatch.expiryDate,
      quantity: mappedBatch.quantity,
      price: mappedBatch.price,
      retailPrice: mappedBatch.retailPrice,
      SupplierId: supplierId,
      ManufactureId: manufactureId,
    });

    try {
      const savedBatch = await newBatch.save();
      await Medicine.findByIdAndUpdate(
        medicineId,
        {
          $inc: { quantityStock: mappedBatch.quantity },
          $push: { batches: savedBatch._id },
        },
        { new: true }
      );
      newBatches.push(savedBatch);
    } catch (error) {
      errors.push(
        `Lỗi khi nhập kho "${mappedBatch.batchNumber}": ${error.message}`
      );
    }
  }

  if (errors.length > 0) {
    return res.json(
      jsonGenerate(StatusCode.PARTIAL_CONTENT, "Một số lô không được nhập", {
        added: newBatches,
        errors,
      })
    );
  }

  res.json(jsonGenerate(StatusCode.CREATED, "Nhập kho thành công", newBatches));
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
  })
    .messages({
      "string.empty": "{#label} không được để trống",
      "any.required": "{#label} là bắt buộc",
      "string.base": "{#label} phải là chuỗi ký tự",
      "date.base": "{#label} không hợp lệ",
      "number.base": "{#label} phải là số",
    })
    .unknown(true);

  return schema.validate(data);
};
