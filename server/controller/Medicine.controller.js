import Medicine from "../model/Medicine.model.js";
import Brand from "../model/Brand.model.js";
import Category from "../model/Category.model.js";
import Batch from "../model/Batch.model.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Joi from "joi";
import { generateID } from "../utils/generateID.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";
import unzipper from "unzipper";
import * as XLSX from "xlsx";
import axios from "axios";
import slugify from "slugify";

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

  // console.log(categoryName);

  try {
    // Find the category by name
    const category = await Category.findOne({ name: categoryName });

    // console.log(category);

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

export const getMedicineBySlug = asyncHandler(async (req, res) => {
  try {
    const { categorySlug, productSlug } = req.query;
    console.log("Tìm kiếm sản phẩm theo slug:", { categorySlug, productSlug });
    
    // Lấy tất cả danh mục
    const categories = await Category.find({});
    console.log("Số lượng danh mục tìm được:", categories.length);
    
    // Tìm danh mục phù hợp bằng cách so sánh slug
    const foundCategory = categories.find(category => {
      const catSlug = slugify(category.name, { lower: true });
      console.log(`So sánh: '${catSlug}' với '${categorySlug}'`);
      return catSlug === categorySlug;
    });
    
    if (!foundCategory) {
      console.log("Không tìm thấy danh mục nào phù hợp với:", categorySlug);
      return res.json(jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy danh mục"));
    }
    
    console.log("Đã tìm thấy danh mục:", foundCategory.name);
    
    // Lấy tất cả thuốc thuộc danh mục này
    const medicines = await Medicine.find({ categoryId: foundCategory._id })
      .populate("categoryId")
      .populate("brandId");
    
    console.log("Số lượng thuốc trong danh mục này:", medicines.length);
    
    // Tìm thuốc phù hợp với slug
    const foundMedicine = medicines.find(medicine => {
      const medSlug = slugify(medicine.name, { lower: true });
      console.log(`So sánh sản phẩm: '${medSlug}' với '${productSlug}'`);
      return medSlug === productSlug;
    });
    
    if (!foundMedicine) {
      console.log("Không tìm thấy thuốc nào phù hợp với:", productSlug);
      return res.json(jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy thuốc"));
    }
    
    console.log("Đã tìm thấy thuốc:", foundMedicine.name);
    
    // Lấy thông tin về batches
    const batches = await Batch.find({ MedicineId: foundMedicine._id })
      .populate("SupplierId")
      .populate("ManufactureId");
      
    foundMedicine._doc.batches = batches;
    
    res.json(
      jsonGenerate(StatusCode.OK, "Lấy thông tin thuốc thành công", foundMedicine)
    );
  } catch (error) {
    console.error("Lỗi trong hàm getMedicineBySlug:", error);
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
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

export const bulkAddMedicines = async (req, res) => {
  const zipFile = req.file;
  // console.log("Received zipFile:", zipFile ? zipFile.originalname : "No file");

  if (!zipFile) {
    return res.json(
      jsonGenerate(StatusCode.BAD_REQUEST, "Vui lòng gửi file .zip")
    );
  }

  try {
    // console.log("Starting zip processing...");
    const zipStream = Readable.from(zipFile.buffer);
    const zip = zipStream.pipe(unzipper.Parse({ forceStream: true }));

    let excelData = null;
    const imageBuffers = new Map();

    // console.log("Parsing zip entries...");
    for await (const entry of zip) {
      const fileName = entry.path;
      // console.log("Processing entry:", fileName);

      const fileBuffer = await entry.buffer();
      if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        // console.log("Reading Excel file:", fileName);
        const workbook = XLSX.read(fileBuffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        excelData = XLSX.utils.sheet_to_json(worksheet);
        // console.log("Excel data extracted:", excelData.length, "rows");
      } else if (fileName.startsWith("images/")) {
        const imageName = fileName.split("/")[1];
        // console.log("Storing image buffer:", imageName);
        imageBuffers.set(imageName, fileBuffer);
      } else {
        // console.log("Skipping unknown file:", fileName);
        entry.autodrain();
      }
    }

    if (!excelData) {
      // console.log("No Excel data found in zip");
      return res.json(
        jsonGenerate(
          StatusCode.BAD_REQUEST,
          "Không tìm thấy file Excel trong zip"
        )
      );
    }

    // console.log("Processing medicines...");
    const uploadedMedicines = [];

    for (const medicineData of excelData) {
      let imageUrls = [];

      if (medicineData["Hình ảnh"]) {
        const imageFileNames = medicineData["Hình ảnh"]
          .split(",")
          .map((name) => name.trim());
        // console.log(
        //   "Image file names for",
        //   medicineData["Tên thuốc"],
        //   ":",
        //   imageFileNames
        // );

        for (const imageFileName of imageFileNames) {
          const imageBuffer = imageBuffers.get(imageFileName);
          // console.log(
          //   "Image buffer for",
          //   imageFileName,
          //   ":",
          //   imageBuffer ? "Found" : "Not found"
          // );

          if (imageBuffer) {
            try {
              // console.log("Uploading", imageFileName, "to Cloudinary...");
              const url = await uploadToCloudinary(imageBuffer, imageFileName);
              imageUrls.push(url);
              // console.log("Uploaded", imageFileName, ":", url);
            } catch (uploadError) {
              console.error(
                "Failed to upload",
                imageFileName,
                ":",
                uploadError.message
              );
            }
          } else {
            console.warn(`Không tìm thấy ảnh ${imageFileName} trong zip`);
          }
        }
      }

      // console.log("Creating medicine:", medicineData["Tên thuốc"]);
      const categoryId = await findOrCreateCategory(
        medicineData["Tên danh mục"]
      );
      const brandId = await findOrCreateBrand(medicineData["Tên thương hiệu"]);
      const medicineId = await generateID(Medicine);

      // Chuẩn hóa giá trị "True"/"False" thành boolean
      const isRxValue = String(medicineData["Kê đơn"]).trim().toLowerCase();
      const discountValue = String(medicineData["Giảm giá"]).trim().toLowerCase();

      // console.log("Medicine ID:", medicineId);
      // console.log("Category ID:", categoryId);
      // console.log("Brand ID:", brandId);

      const newMedicine = new Medicine({
        id: medicineId,
        name: medicineData["Tên thuốc"],
        dosage: medicineData["Liều lượng"],
        unit: medicineData["Đơn vị"],
        instruction: medicineData["Hướng dẫn"] || "",
        description: medicineData["Mô tả"] || "",
        uses: medicineData["Công dụng"] || "",
        packaging: medicineData["Quy cách đóng gói"],
        effect: medicineData["Tác dụng phụ"] || "",
        isRx: isRxValue === "true",
        drugUser: medicineData["Đối tượng sử dụng"] || "",
        brandId: brandId,
        categoryId: categoryId,
        isDiscount: discountValue === "true",
        discountPercentage: Number(medicineData["Phần trăm giảm giá"]) || 0,
        ingredients: medicineData["Thành phần"]?.split(", ") || [], // Giữ nguyên mảng
        images: imageUrls,
      });

      const savedMedicine = await newMedicine.save();
      uploadedMedicines.push(savedMedicine);
      // console.log("Saved medicine:", savedMedicine.name);
    }

    // console.log("Processing complete, sending response...");
    return res.json(
      jsonGenerate(
        StatusCode.CREATED,
        "Nhập thuốc thành công",
        uploadedMedicines
      )
    );
  } catch (error) {
    console.error("Error in bulkAddMedicines:", error);
    return res.json(
      jsonGenerate(
        StatusCode.INTERNAL_SERVER_ERROR,
        "Lỗi máy chủ khi nhập thuốc: " + error.message
      )
    );
  }
};

const uploadToCloudinary = async (buffer, fileName) => {
  const formData = new FormData();
  const blob = new Blob([buffer], { type: "image/png" }); // Điều chỉnh type nếu cần
  formData.append("file", blob, fileName);
  formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(
      process.env.CLOUDINARY_IMAGE_URL,
      formData,
      { timeout: 30000 } // Timeout 30s
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    throw new Error(`Không thể upload ảnh ${fileName}`);
  }
};

const findOrCreateCategory = async (categoryName) => {
  let category = await Category.findOne({ name: categoryName });
  if (!category) {
    category = new Category({ name: categoryName });
    await category.save();
  }
  return category._id;
};

const findOrCreateBrand = async (brandName) => {
  let brand = await Brand.findOne({ name: brandName });
  if (!brand) {
    let id = await generateID(Brand);
    brand = new Brand({ id, name: brandName });
    await brand.save();
  }
  return brand._id;
};

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
    ingredients: Joi.string().required().label("Thành phần"),
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
