import express from "express";
import { getPointHistories } from "../controller/PointHistory.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getPointHistories", authenticate, getPointHistories);

export default router;