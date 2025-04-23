import express from "express";
import {
  getDailyRevenue,
  getDashboardOverview,
  getExpiredMedicines,
  getExpiringMedicines,
  getMonthlyRevenue,
  getBestSellingMedicines,
  getSlowestSellingMedicines,
  getTopCustomers,
} from "../controller/Statistics.controller.js";

const router = express.Router();

router.get("/getExpiringMedicines", getExpiringMedicines);
router.get("/getExpiredMedicines", getExpiredMedicines);
router.get("/getDailyRevenue", getDailyRevenue);
router.get("/getMonthlyRevenue", getMonthlyRevenue);
router.get("/getDashboardOverview", getDashboardOverview);
router.get("/bestSellingMedicines", getBestSellingMedicines);
router.get("/slowestSellingMedicines", getSlowestSellingMedicines);
router.get("/topCustomers", getTopCustomers);

export default router;
