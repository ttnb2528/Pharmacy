import express from "express";
import {
  addMedicine,
  bulkAddMedicines,
  deleteMedicine,
  getMedicine,
  getMedicineByBestSelling,
  getMedicineByHistory,
  getMedicines,
  getMedicinesByCategory,
  getMedicinesByCategoryName,
  getMedicinesByIsDiscount,
  updateImagesMedicine,
  updateMedicine,
} from "../controller/Medicine.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/addMedicine", addMedicine);
// router.post("/bulkAddMedicines", bulkAddMedicines);
router.post("/bulkAddMedicines", upload.single("zipFile"), bulkAddMedicines);
router.post("/getMedicineByHistory", getMedicineByHistory);
router.get("/getMedicines", getMedicines);
router.get("/getMedicinesByIsDiscount", getMedicinesByIsDiscount);
router.get("/getMedicineByCategory/:categoryId", getMedicinesByCategory);
router.get(
  "/getMedicinesByCategoryName/:categoryName",
  getMedicinesByCategoryName
);
router.get("/getMedicineByBestSelling", getMedicineByBestSelling);
router.get("/getMedicine/:id", getMedicine);
router.put("/updateMedicine/:id", updateMedicine);
router.put("/updateImagesMedicine/:id", updateImagesMedicine);
router.delete("/deleteMedicine/:id", deleteMedicine);

export default router;
