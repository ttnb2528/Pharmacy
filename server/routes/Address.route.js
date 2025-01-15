import express from "express";
import {
  addAddress,
  deleteAddress,
  getAddress,
  getAllAddress,
  updateAddress,
} from "../controller/Address.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addAddress", authenticate, addAddress);
router.get("/getAllAddress", authenticate, getAllAddress);
router.get("/getAddress/:id", authenticate, getAddress);
router.put("/updateAddress/:id", authenticate, updateAddress);
router.delete("/deleteAddress/:id", authenticate, deleteAddress);

export default router;
