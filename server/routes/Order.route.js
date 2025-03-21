import express from "express";
import {
  checkPurchase,
  createOrder,
  deleteOrder,
  getCurrentUserOrders,
  getOrderById,
  getOrderByVnpTxnRef,
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
router.get("/getOrderDetail/:type/:orderId", getOrderDetail);
router.get("/checkPurchase/:userId/:productId", checkPurchase);
router.get("/by-vnp-txn-ref", getOrderByVnpTxnRef);
router.put("/updateStatusOrder/:orderId", updateStatusOrder);
router.delete("/deleteOrder", deleteOrder);

export default router;
