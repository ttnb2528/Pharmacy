import Medicine from "../model/Medicine.model.js";
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
  const medicines = await Medicine.find()
    .populate("categoryId")
    .populate("brandId");

  for (let medicine of medicines) {
    const batches = await Batch.find({ MedicineId: medicine._id })
      .populate("SupplierId")
      .populate("ManufactureId");
    medicine._doc.batches = batches; // Gán kết quả vào medicine object
  }

  res
    .status(StatusCode.OK)
    .json(
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
  res
    .status(StatusCode.OK)
    .json(
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

    res
      .status(StatusCode.OK)
      .json(
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
      const medicines = await Medicine.find({ categoryId: category._id });

      console.log(medicines);
      
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
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json(
        jsonGenerate(
          StatusCode.INTERNAL_SERVER_ERROR,
          `Lấy danh sách thuốc theo nhóm '${categoryName}' thất bại`,
          error
        )
      );
  }
});

export const getMedicine = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const medicine = await Medicine.findById(id)
    .populate("categoryId")
    .populate("brandId");

  for (let medicine of medicines) {
    const batches = await Batch.find({ MedicineId: medicine._id })
      .populate("SupplierId")
      .populate("ManufactureId");
    medicine._doc.batches = batches; // Gán kết quả vào medicine object
  }
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

  res
    .status(StatusCode.OK)
    .json(
      jsonGenerate(
        StatusCode.OK,
        "Lấy danh sách thuốc bán chạy nhất thành công",
        medicines
      )
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
