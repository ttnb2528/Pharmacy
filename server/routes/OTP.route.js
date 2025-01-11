import express from "express";
import {
  createApplication,
  deliveryPassCode,
  setUpMessageTemplate,
  verifyPassCode,
} from "../controller/OTP.controller.js";

const router = express.Router();

router.post("/createApplication", createApplication);
router.post("/setUpMessageTemplate", setUpMessageTemplate);
router.post("/deliveryPassCode", deliveryPassCode);
router.post("/verifyPassCode", verifyPassCode);

export default router;
