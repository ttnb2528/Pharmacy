import express from "express";
import { createBill, getBills } from "../controller/Bill.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createBill", authenticate, createBill);
router.get("/getBills", authenticate, getBills);

export default router;
