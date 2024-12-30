import express from "express";
import {
  addManufacture,
  deleteManufacture,
  getManufacture,
  getManufactures,
  updateManufacture,
} from "../controller/Manufacture.controller.js";

const router = express.Router();

router.post("/addManufacture", addManufacture);
router.get("/getManufactures", getManufactures);
router.get("/getManufacture/:id", getManufacture);
router.put("/updateManufacture/:id", updateManufacture);
router.delete("/deleteManufacture/:id", deleteManufacture);

export default router;
