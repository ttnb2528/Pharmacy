import express from "express";
import { createBill } from "../controller/Bill.controller.js";

const router = express.Router();

router.post("/createBill", createBill);

export default router;
