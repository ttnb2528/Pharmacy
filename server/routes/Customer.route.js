import express from "express";
import {
  addProfileImage,
  addToCart,
  clearCart,
  deleteCustomer,
  getCustomerById,
  getCustomers,
  getUserInfo,
  removeFromCart,
  removeProductFromCart,
  removeProfileImage,
  updateCart,
  updateCustomer,
  updatePassword,
} from "../controller/User.controller.js";
import {
  authenticate,
  authorize,
  authorizeAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-profile-image", authenticate, addProfileImage);
router.post("/addToCart", authenticate, addToCart);
router.post("/removeFromCart", authenticate, removeFromCart);
router.post("/removeProductFromCart", authenticate, removeProductFromCart);
router.post("/updateCart", authenticate, updateCart);
router.post("/clearCart", authenticate, clearCart);
router.delete("/remove-profile-image", authenticate, removeProfileImage);
router.get("/getUserInfo", authenticate, getUserInfo);
router.get("/:id", authenticate, getCustomerById);
router.put("/profile/:id", authenticate, updateCustomer);
router.put("/update-password/:id", authenticate, updatePassword);

// ROLE: Admin and Staff
router.get("/", authenticate, authorize, getCustomers);
router.delete("/:id", authenticate, authorizeAdmin, deleteCustomer);

export default router;
