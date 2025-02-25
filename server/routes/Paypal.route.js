import express from "express";
import { createPayPalOrder } from "../controller/Paypal.controller.js";

const router = express.Router();

router.post("/createOrder", createPayPalOrder);

export default router;
