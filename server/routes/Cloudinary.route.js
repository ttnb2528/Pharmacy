import express from "express";
import { removeImage } from "../controller/Cloudinary.controller.js";

const router = express.Router();

router.post("/removeImage", removeImage);

export default router;
