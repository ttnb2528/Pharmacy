import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  bulkImportBatches,
  createBatch,
  deleteBatch,
  getBatchById,
  getBatches,
  getBatchesForMedicine,
  getBatchesForStatistics,
  updateBatch,
  updateBatchPartial,
} from "../controller/Batch.controller.js";
const router = express.Router();

router.post("/createBatch", authenticate, createBatch);
router.post("/bulkImportBatches", authenticate, bulkImportBatches);
router.get("/getBatches", authenticate, getBatches);
router.get("/getBatchesForMedicine/:id", authenticate, getBatchesForMedicine);
router.get("/getBatchesForStatistics", authenticate, getBatchesForStatistics);
router.get("/getBatchById/:id", authenticate, getBatchById);
router.put("/updateBatch/:id", authenticate, updateBatch);
router.put("/update-partial/:id", authenticate, updateBatchPartial);
router.delete("/deleteBatch/:id", authenticate, deleteBatch);

export default router;
