import express from "express";
import {
  addShiftWork,
  deleteShiftWork,
  getShiftWork,
  getShiftWorks,
  updateShiftWork,
} from "../controller/Shiftwork.controller.js";

const router = express.Router();

router.post("/addShiftWork", addShiftWork);
router.get("/getShiftWorks", getShiftWorks);
router.get("/getShiftWork/:id", getShiftWork);
router.put("/updateShiftWork/:id", updateShiftWork);
router.delete("/deleteShiftWork/:id", deleteShiftWork);

export default router;
