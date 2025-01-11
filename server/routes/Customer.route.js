import express from "express";
import {
  deleteCustomer,
  getCustomerById,
  getCustomers,
  getUserInfo,
  updateCustomer,
} from "../controller/User.controller.js";
import {
  authenticate,
  authorize,
  authorizeAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getUserInfo", authenticate, getUserInfo);
router.get("/:id", authenticate, getCustomerById);
router.put("/profile/:id", authenticate, updateCustomer);

// ROLE: Admin and Staff
router.get("/", authenticate, authorize, getCustomers);
router.delete("/:id", authenticate, authorizeAdmin, deleteCustomer);

export default router;
