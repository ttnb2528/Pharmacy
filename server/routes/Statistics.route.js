import express from "express";
import { getExpiringMedicines } from "../controller/Statistics.controller.js";

const router = express.Router();

router.get("/getExpiringMedicines", getExpiringMedicines);

export default router;
