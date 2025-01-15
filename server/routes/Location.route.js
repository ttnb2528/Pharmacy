import express from "express";
import {
  getDistricts,
  getProvinces,
  getWards,
} from "../controller/Location.controller.js";

const router = express.Router();

router.get("/getProvinces", getProvinces);
router.get("/getDistricts/:provinceId", getDistricts);
router.get("/getWards/:districtId", getWards);

export default router;
