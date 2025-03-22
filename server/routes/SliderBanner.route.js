import express from "express";
import {
  createSliderBanner,
  updateImageSliderBanner,
  getAllSliderBanner,
  updateSliderBanner,
  deleteSliderBanner,
} from "../controller/SlideBanner.controller.js";

const router = express.Router();

router.post("/createSliderBanner", createSliderBanner);
router.put("/updateImageSliderBanner/:id", updateImageSliderBanner);
router.get("/getAllSliderBanner", getAllSliderBanner);
router.put("/updateSliderBanner/:id", updateSliderBanner);
router.delete("/deleteSliderBanner/:id", deleteSliderBanner);

export default router;
