import express from "express";
import {
  addProfileImage,
  deleteCustomer,
  getCustomerById,
  getCustomers,
  getUserInfo,
  removeProfileImage,
  updateCustomer,
} from "../controller/User.controller.js";
import {
  authenticate,
  authorize,
  authorizeAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-profile-image", authenticate, addProfileImage);
router.delete("/remove-profile-image", authenticate, removeProfileImage);
router.get("/getUserInfo", authenticate, getUserInfo);
router.get("/:id", authenticate, getCustomerById);
router.put("/profile/:id", authenticate, updateCustomer);

// ROLE: Admin and Staff
router.get("/", authenticate, authorize, getCustomers);
router.delete("/:id", authenticate, authorizeAdmin, deleteCustomer);

export default router;
