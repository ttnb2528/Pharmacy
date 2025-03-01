import express from "express";
import {
  checkPurchase,
  createOrder,
  deleteOrder,
  getCurrentUserOrders,
  getOrderById,
  getOrderDetail,
  getOrders,
  updateStatusOrder,
} from "../controller/Order.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createOrder", authenticate, createOrder);
router.get("/getOrders", getOrders);
router.get("/getCurrentUserOrders", authenticate, getCurrentUserOrders);
router.get("/getOrderById", getOrderById);
router.get("/getOrderDetail/:orderId", getOrderDetail);
router.get("/checkPurchase/:userId/:productId", checkPurchase);
router.put("/updateStatusOrder/:orderId", updateStatusOrder);
router.delete("/deleteOrder", deleteOrder);

export default router;
