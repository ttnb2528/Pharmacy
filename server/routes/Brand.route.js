import express from "express";
import { addBrand } from "../controller/Brand.controller.js";

const router = express.Router();

router.post("/addBrand", addBrand);


export default router;
