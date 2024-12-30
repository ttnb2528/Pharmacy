import express from "express";
import {
  addMedicine,
  deleteMedicine,
  getMedicine,
  getMedicines,
  updateMedicine,
} from "../controller/Medicine.controller.js";

const router = express.Router();

router.post("/addMedicine", addMedicine);
router.get("/getMedicines", getMedicines);
router.get("/getMedicine/:id", getMedicine);
router.delete("/deleteMedicine/:id", deleteMedicine);
router.put("/updateMedicine/:id", updateMedicine);

export default router;
