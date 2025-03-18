import express from "express";
import { createPaymentUrl, refund, vnpayReturn } from "../controller/VNPAY.controller.js";

const router = express.Router();

router.post("/create_payment_url", createPaymentUrl);
router.get("/vnpay_return", vnpayReturn);
router.post("/refund", refund);

export default router;