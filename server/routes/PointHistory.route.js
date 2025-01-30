import express from "express";
import { getPointHistories } from "../controller/PointHistory.controller.js";

const router = express.Router();

router.get("/getPointHistories", getPointHistories);

export default router;