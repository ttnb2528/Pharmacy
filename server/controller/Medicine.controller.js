import Medicine from "../model/Medicine.model.js";
import Brand from "../model/Brand.model.js";
import Category from "../model/Category.model.js";
import Batch from "../model/Batch.model.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Joi from "joi";
import { generateID } from "../utils/generateID.js";

export const addMedicine = asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.json(
      jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
    );
  }

  const medicineExist = await Medicine.findOne({ name: req.body.name });

  if (medicineExist) {
    return res.json(jsonGenerate(StatusCode.BAD_REQUEST, "Thuốc đã tồn tại"));
  }

  let id = await generateID(Medicine);

  const newMedicine = new Medicine({
    id: id,
    ...req.body,
  });

  const medicine = await newMedicine.save();

  res.json(jsonGenerate(StatusCode.CREATED, "Thêm thuốc thành công", medicine));
});

export const getMedicines = asyncHandler(async (req, res) => {
  const medicines = await Medicine.find()
    .populate("categoryId")
    .populate("brandId");

  for (let medicine of medicines) {
    const batches = await Batch.find({ MedicineId: medicine._id })
      .populate("SupplierId")
      .populate("ManufactureId");
    medicine._doc.batches = batches; // Gán kết quả vào medicine object
  }

  res.json(
    jsonGenerate(StatusCode.OK, "Lấy danh sách thuốc thành công", medicines)
  );
});

export const getMedicinesByIsDiscount = asyncHandler(async (req, res) => {
  const medicines = await Medicine.find({ isDiscount: true })
    .populate("categoryId")
    .populate("brandId");

  for (let medicine of medicines) {
    const batches = await Batch.find({ MedicineId: medicine._id })
      .populate("SupplierId")
      .populate("ManufactureId");
    medicine._doc.batches = batches; // Gán kết quả vào medicine object
  }
  res.json(
    jsonGenerate(StatusCode.OK, "Lấy danh sách thuốc thành công", medicines)
  );
});

export const getMedicinesByCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    const medicines = await Medicine.find({ categoryId })
      .populate("categoryId")
      .populate("brandId");

    for (let medicine of medicines) {
      const batches = await Batch.find({ MedicineId: medicine._id })
        .populate("SupplierId")
        .populate("ManufactureId");
      medicine._doc.batches = batches; // Gán kết quả vào medicine object
    }

    res.json(
      jsonGenerate(StatusCode.OK, "Lấy danh sách thuốc thành công", medicines)
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getMedicinesByCategoryName = asyncHandler(async (req, res) => {
  const { categoryName } = req.params;

  console.log(categoryName);

  try {
    // Find the category by name
    const category = await Category.findOne({ name: categoryName });

    console.log(category);

    // If the category exists, find all medicines associated with it
    if (category) {
      const medicines = await Medicine.find({ categoryId: category._id })
        .limit(10)
        .populate("categoryId")
        .populate("brandId");

      for (let medicine of medicines) {
        const batches = await Batch.find({ MedicineId: medicine._id })
          .populate("SupplierId")
          .populate("ManufactureId");
        medicine._doc.batches = batches; // Gán kết quả vào medicine object
      }

      res.json(
        jsonGenerate(
          StatusCode.OK,
          `Lấy danh sách thuốc theo nhóm '${categoryName}' thành công`,
          medicines
        )
      );
    } else {
      // If the category doesn't exist, send an error response
      res.json(
        jsonGenerate(
          StatusCode.NOT_FOUND,
          `Không tìm thấy nhóm '${categoryName}'`
        )
      );
    }
  } catch (error) {
    // Handle any errors that occur during the query
    res.json(
      jsonGenerate(
        StatusCode.INTERNAL_SERVER_ERROR,
        `Lấy danh sách thuốc theo nhóm '${categoryName}' thất bại`,
        error
      )
    );
  }
});

export const getMedicineByHistory = asyncHandler(async (req, res) => {
  try {
    const { productIds } = req.body;

    const products = await Medicine.find({ _id: { $in: productIds } })
      .populate("categoryId")
      .populate("brandId");

    for (let medicine of products) {
      const batches = await Batch.find({ MedicineId: medicine._id })
        .populate("SupplierId")
        .populate("ManufactureId");
      medicine._doc.batches = batches; // Gán kết quả vào medicine object
    }

    const sortedProducts = productIds
      .map((id) => products.find((product) => product._id.toString() === id))
      .filter(Boolean);

    res.json(
      jsonGenerate(
        StatusCode.OK,
        "Lấy danh sách thuốc theo lịch sử xem thành công",
        sortedProducts
      )
    );
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getMedicine = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const medicine = await Medicine.findById(id)
    .populate("categoryId")
    .populate("brandId");

  const batches = await Batch.find({ MedicineId: medicine._id })
    .populate("SupplierId")
    .populate("ManufactureId");
  medicine._doc.batches = batches; // Gán kết quả vào medicine object

  if (!medicine) {
    return res.json(jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy thuốc"));
  }
  res.json(
    jsonGenerate(StatusCode.OK, "Lấy thông tin thuốc thành công", medicine)
  );
});

export const getMedicineByBestSelling = asyncHandler(async (req, res) => {
  const medicines = await Medicine.find()
    .sort({ sold: -1 })
    .limit(10)
    .populate("categoryId")
    .populate("brandId");

  for (let medicine of medicines) {
    const batches = await Batch.find({ MedicineId: medicine._id })
      .populate("SupplierId")
      .populate("ManufactureId");
    medicine._doc.batches = batches;
  }

  if (!medicines) {
    if (medicines.length === 0) {
      medicines = await Medicine.aggregate([{ $sample: { size: 10 } }]);
    }
  }

  res.json(
    jsonGenerate(
      StatusCode.OK,
      "Lấy danh sách thuốc bán chạy nhất thành công",
      medicines
    )
  );
});

export const deleteMedicine = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const medicine = await Medicine.findById(id)
    .populate("categoryId")
    .populate("brandId");

  const batches = await Batch.find({ MedicineId: medicine._id })
    .populate("SupplierId")
    .populate("ManufactureId");

  medicine._doc.batches = batches; // Gán kết quả vào medicine object

  if (!medicine) {
    return res.json(jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy thuốc"));
  }

  await Medicine.findByIdAndUpdate(id, {
    deleted: true,
  });
  res.json(jsonGenerate(StatusCode.OK, "Xóa thuốc thành công", medicine));
});

export const updateMedicine = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const medicine = await Medicine.findById(id);

  if (!medicine) {
    return res.json(jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy thuốc"));
  }

  const { error } = validate(req.body);

  if (error) {
    return res.json(
      jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
    );
  }

  const medicineExist = await Medicine.findOne({
    name: req.body.name,
    _id: { $ne: id },
  });

  if (medicineExist) {
    return res.json(
      jsonGenerate(StatusCode.BAD_REQUEST, "Tên thuốc đã tồn tại")
    );
  }

  const updateMedicine = await Medicine.findByIdAndUpdate(id, req.body, {
    new: true,
  })
    .populate("categoryId")
    .populate("brandId");

  res.json(
    jsonGenerate(StatusCode.OK, "Cập nhật thuốc thành công", updateMedicine)
  );
});

export const updateImagesMedicine = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const medicine = await Medicine.findById(id)
    .populate("categoryId")
    .populate("brandId");

  const batches = await Batch.find({ MedicineId: medicine._id })
    .populate("SupplierId")
    .populate("ManufactureId");

  medicine._doc.batches = batches; // Gán kết quả vào medicine object

  if (!medicine) {
    return res.json(jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy thuốc"));
  }

  const newMedicine = await Medicine.findByIdAndUpdate(
    id,
    { images: req.body.images },
    { new: true }
  );

  res.json(
    jsonGenerate(
      StatusCode.OK,
      "Cập nhật hình ảnh thuốc thành công",
      newMedicine
    )
  );
});

export const bulkAddMedicines = asyncHandler(async (req, res) => {
  const { medicines } = req.body;

  if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
    return res.json(
      jsonGenerate(StatusCode.BAD_REQUEST, "Dữ liệu không hợp lệ")
    );
  }

  const newMedicines = [];
  const errors = [];

  // for (const med of medicines) {
  //   const medicineExist = await Medicine.findOne({ name: med.name });
  //   if (medicineExist) {
  //     errors.push(`Thuốc "${med.name}" đã tồn tại`);
  //     continue;
  //   }

  //   // Tìm categoryId từ categoryName
  //   let categoryId;
  //   if (med.categoryName) {
  //     const category = await Category.findOne({ name: med.categoryName });
  //     if (!category) {
  //       errors.push(`Danh mục "${med.categoryName}" không tồn tại`);
  //       continue; // Bỏ qua nếu không tìm thấy danh mục
  //     }
  //     categoryId = category._id;
  //   } else {
  //     errors.push(`Thuốc "${med.name}" thiếu tên danh mục`);
  //     continue;
  //   }

  //   // Tìm brandId từ brandName
  //   let brandId;
  //   if (med.brandName) {
  //     let brand = await Brand.findOne({ name: med.brandName });
  //     if (!brand) {
  //       // Tạo mới thương hiệu nếu không tìm thấy
  //       let id = await generateID(Brand);
  //       brand = new Brand({ id, name: med.brandName });
  //       await brand.save();
  //       console.log(`Đã tạo thương hiệu mới: ${med.brandName}`);
  //     }
  //     brandId = brand._id;
  //   } else {
  //     errors.push(`Thuốc "${med.name}" thiếu tên thương hiệu`);
  //     continue;
  //   }

  //   const id = await generateID(Medicine);
  //   const newMedicine = new Medicine({
  //     id,
  //     name: med.name,
  //     dosage: med.dosage,
  //     unit: med.unit,
  //     instruction: med.instruction,
  //     description: med.description,
  //     uses: med.uses,
  //     packaging: med.packaging,
  //     effect: med.effect,
  //     isRx: med.isRx === "true" || med.isRx === true, // Chuyển đổi từ string sang boolean
  //     drugUser: med.drugUser,
  //     categoryId,
  //     brandId,
  //     isDiscount: med.isDiscount === "true" || med.isDiscount === true || false,
  //     percentDiscount: Number(med.percentDiscount) || 0,
  //     quantityStock: 0, // Mặc định khi thêm mới
  //     images: med.images || [],
  //   });

  //   try {
  //     const savedMedicine = await newMedicine.save();
  //     newMedicines.push(savedMedicine);
  //   } catch (error) {
  //     errors.push(`Lỗi khi thêm "${med.name}": ${error.message}`);
  //   }
  // }

  for (const med of medicines) {
    // Ánh xạ từ tên cột tiếng Việt sang tên trường trong schema
    const mappedMed = {
      name: med["Tên thuốc"],
      dosage: med["Liều lượng"],
      unit: med["Đơn vị"],
      instruction: med["Hướng dẫn"],
      description: med["Mô tả"],
      uses: med["Công dụng"],
      packaging: med["Quy cách đóng gói"],
      effect: med["Tác dụng phụ"],
      isRx: med["Kê đơn"] === "True" || med["Kê đơn"] === true,
      drugUser: med["Đối tượng sử dụng"],
      categoryName: med["Tên danh mục"],
      brandName: med["Tên thương hiệu"],
      isDiscount:
        med["Giảm giá"] === "True" || med["Giảm giá"] === true || false,
      percentDiscount: Number(med["Phần trăm giảm giá"]) || 0,
    };

    // Kiểm tra dữ liệu bắt buộc
    if (!mappedMed.name) {
      errors.push(`Thiếu "Tên thuốc" trong dòng dữ liệu`);
      continue;
    }

    const medicineExist = await Medicine.findOne({ name: mappedMed.name });
    if (medicineExist) {
      errors.push(`Thuốc "${mappedMed.name}" đã tồn tại`);
      continue;
    }

    // Tìm categoryId từ categoryName
    let categoryId;
    if (mappedMed.categoryName) {
      const category = await Category.findOne({ name: mappedMed.categoryName });
      if (!category) {
        errors.push(`Danh mục "${mappedMed.categoryName}" không tồn tại`);
        continue;
      }
      categoryId = category._id;
    } else {
      errors.push(`Thuốc "${mappedMed.name}" thiếu "Tên danh mục"`);
      continue;
    }

    // Tìm brandId từ brandName
    let brandId;
    if (mappedMed.brandName) {
      const brand = await Brand.findOne({ name: mappedMed.brandName });
      if (!brand) {
        errors.push(`Thương hiệu "${mappedMed.brandName}" không tồn tại`);
        continue;
      }
      brandId = brand._id;
    } else {
      errors.push(`Thuốc "${mappedMed.name}" thiếu "Tên thương hiệu"`);
      continue;
    }

    const id = await generateID(Medicine);
    const newMedicine = new Medicine({
      id,
      name: mappedMed.name,
      dosage: mappedMed.dosage,
      unit: mappedMed.unit,
      instruction: mappedMed.instruction,
      description: mappedMed.description,
      uses: mappedMed.uses,
      packaging: mappedMed.packaging,
      effect: mappedMed.effect,
      isRx: mappedMed.isRx,
      drugUser: mappedMed.drugUser,
      categoryId,
      brandId,
      isDiscount: mappedMed.isDiscount,
      percentDiscount: mappedMed.percentDiscount,
      quantityStock: 0,
      images: [],
    });

    try {
      const savedMedicine = await newMedicine.save();
      newMedicines.push(savedMedicine);
    } catch (error) {
      errors.push(`Lỗi khi thêm "${mappedMed.name}": ${error.message}`);
    }
  }

  if (errors.length > 0) {
    return res.json(
      jsonGenerate(StatusCode.PARTIAL_CONTENT, "Một số thuốc không được thêm", {
        added: newMedicines,
        errors,
      })
    );
  }

  res.json(
    jsonGenerate(
      StatusCode.CREATED,
      "Thêm danh sách thuốc thành công",
      newMedicines
    )
  );
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
