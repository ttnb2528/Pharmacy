import express from "express";
import {
  addSupplier,
  deleteSupplier,
  getSupplier,
  getSuppliers,
  updateSupplier,
} from "../controller/Supplier.controller.js";

const router = express.Router();

router.post("/addSupplier", addSupplier);
router.get("/getSuppliers", getSuppliers);
router.get("/getSupplier/:id", getSupplier);
router.put("/updateSupplier/:id", updateSupplier);
router.delete("/deleteSupplier/:id", deleteSupplier);

export default router;
