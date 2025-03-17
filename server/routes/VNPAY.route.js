import express from "express";
import { createPaymentUrl, vnpayReturn } from "../controller/VNPAY.controller.js";

const router = express.Router();

router.post("/create_payment_url", createPaymentUrl);
router.get("/vnpay_return", vnpayReturn);

export default router;