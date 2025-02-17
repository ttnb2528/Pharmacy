import express from "express";
import {
  getExpiredMedicines,
  getExpiringMedicines,
} from "../controller/Statistics.controller.js";

const router = express.Router();

router.get("/getExpiringMedicines", getExpiringMedicines);
router.get("/getExpiredMedicines", getExpiredMedicines);

export default router;
