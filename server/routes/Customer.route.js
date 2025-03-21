import express from "express";
import {
  addProfileImage,
  addToCart,
  clearCart,
  createCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomers,
  getUserInfo,
  removeFromCart,
  removeProductFromCart,
  removeProfileImage,
  updateCart,
  updateCustomer,
  updateEmail,
  updatePassword,
} from "../controller/User.controller.js";
import {
  authenticate,
  authorize,
  authorizeAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createCustomer", authenticate, createCustomer);
router.post("/add-profile-image", authenticate, addProfileImage);
router.post("/addToCart", authenticate, addToCart);
router.post("/removeFromCart", authenticate, removeFromCart);
router.post("/removeProductFromCart", authenticate, removeProductFromCart);
router.post("/updateCart", authenticate, updateCart);
router.post("/clearCart", authenticate, clearCart);
router.delete("/remove-profile-image", authenticate, removeProfileImage);
router.get("/getUserInfo", authenticate, getUserInfo);
router.get("/getCustomers", getCustomers);
router.get("/:id", authenticate, getCustomerById);
router.put("/profile/:id", authenticate, updateCustomer);
router.put("/update-email/:id", authenticate, updateEmail);
router.put("/update-password/:id", authenticate, updatePassword);

// ROLE: Admin and Staff
router.delete("/deleteCustomer/:id", deleteCustomer);

export default router;
