import express from "express";
import { createBill, createReturnBill, getBillById, getBills } from "../controller/Bill.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createBill", authenticate, createBill);
router.get("/getBills", authenticate, getBills);
router.get("/get-by-id/:id", authenticate, getBillById);
router.post("/return", authenticate, createReturnBill);

export default router;
