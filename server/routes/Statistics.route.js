import express from "express";
import {
  getDailyRevenue,
  getExpiredMedicines,
  getExpiringMedicines,
} from "../controller/Statistics.controller.js";

const router = express.Router();

router.get("/getExpiringMedicines", getExpiringMedicines);
router.get("/getExpiredMedicines", getExpiredMedicines);
router.get("/getDailyRevenue", getDailyRevenue);

export default router;
