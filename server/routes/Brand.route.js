import express from "express";
import {
  addBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
} from "../controller/Brand.controller.js";

const router = express.Router();

router.post("/addBrand", addBrand);
router.get("/getBrands", getBrands);
router.get("/getBrand/:id", getBrand);
router.put("/updateBrand/:id", updateBrand);
router.delete("/deleteBrand/:id", deleteBrand);

export default router;
