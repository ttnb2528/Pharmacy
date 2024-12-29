import express from "express";
import { addMedicine } from "../controller/Medicine.controller.js";

const router = express.Router();

router.post("/addMedicine", addMedicine);

export default router;
