import express from "express";
import {
  createStaff,
  deleteStaff,
  getStaff,
  getStaffs,
  updateStaff,
} from "../controller/Staff.controller.js";

const router = express.Router();

router.post("/create", createStaff);
router.get("/getStaffs", getStaffs);
router.get("/getStaff/:id", getStaff);
router.put("/updateStaff/:id", updateStaff);
router.delete("/deleteStaff/:id", deleteStaff);

export default router;
