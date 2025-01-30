import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAvailableCoupons,
  getCoupon,
  getCoupons,
  updateCoupon,
} from "../controller/Coupon.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/createCoupon", createCoupon);
router.get("/getCoupons", authenticate, getCoupons);
router.get("/getAvailableCoupons", authenticate, getAvailableCoupons);
router.get("/getCoupon/:id", getCoupon);
router.put("/updateCoupon/:id", updateCoupon);
router.delete("/deleteCoupon/:id", deleteCoupon);

export default router;
