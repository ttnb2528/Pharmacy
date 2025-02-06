import express from "express";
import {
  createStaff,
  deleteStaff,
  getCurrentStaff,
  getStaff,
  getStaffs,
  updatePassword,
  updateStaff,
} from "../controller/Staff.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createStaff", createStaff);
router.get("/getStaffs", getStaffs);
router.get("/getStaff/:id", getStaff);
router.get("/getCurrentStaff", authenticate, getCurrentStaff);
router.put("/updateStaff/:id", updateStaff);
router.put("/update-password-admin/:id", authenticate, updatePassword);
router.delete("/deleteStaff/:id", deleteStaff);

export default router;
