import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  createBatch,
  deleteBatch,
  getBatchById,
  getBatches,
  updateBatch,
} from "../controller/Batch.controller.js";
const router = express.Router();

router.post("/createBatch", authenticate, createBatch);
router.get("/getBatches", authenticate, getBatches);
router.get("/getBatchById/:id", authenticate, getBatchById);
router.put("/updateBatch/:id", authenticate, updateBatch);
router.delete("/deleteBatch/:id", authenticate, deleteBatch);

export default router;
