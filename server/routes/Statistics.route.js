import express from "express";
import {
  getDailyRevenue,
  getExpiredMedicines,
  getExpiringMedicines,
  getMonthlyRevenue,
} from "../controller/Statistics.controller.js";

const router = express.Router();

router.get("/getExpiringMedicines", getExpiringMedicines);
router.get("/getExpiredMedicines", getExpiredMedicines);
router.get("/getDailyRevenue", getDailyRevenue);
router.get("/getMonthlyRevenue", getMonthlyRevenue);

export default router;
