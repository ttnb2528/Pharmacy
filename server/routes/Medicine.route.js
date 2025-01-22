import express from "express";
import {
  addMedicine,
  deleteMedicine,
  getMedicine,
  getMedicineByBestSelling,
  getMedicines,
  getMedicinesByCategory,
  getMedicinesByIsDiscount,
  updateMedicine,
} from "../controller/Medicine.controller.js";

const router = express.Router();

router.post("/addMedicine", addMedicine);
router.get("/getMedicines", getMedicines);
router.get("/getMedicinesByIsDiscount", getMedicinesByIsDiscount);
router.get("/getMedicineByCategory/:categoryId", getMedicinesByCategory);
router.get("/getMedicineByBestSelling", getMedicineByBestSelling);
router.get("/getMedicine/:id", getMedicine);
router.delete("/deleteMedicine/:id", deleteMedicine);
router.put("/updateMedicine/:id", updateMedicine);

export default router;
