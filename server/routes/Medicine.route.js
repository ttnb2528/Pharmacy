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

const router = express.Router();

router.post("/addMedicine", addMedicine);
router.post("/bulkAddMedicines", bulkAddMedicines);
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
