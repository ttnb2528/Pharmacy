import express from "express";
import { addCategory } from "../controller/Category.controller.js";

const router = express.Router();

router.post("/addCategory", addCategory);

export default router;
