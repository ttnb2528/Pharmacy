import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controller/Category.controller.js";

const router = express.Router();

router.post("/addCategory", addCategory);
router.get("/getCategories", getCategories);
router.get("/getCategory/:id", getCategory);
router.put("/updateCategory/:id", updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);

export default router;
