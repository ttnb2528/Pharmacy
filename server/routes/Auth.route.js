import express from "express";
import {
  login,
  loginAdmin,
  logout,
  signup,
} from "../controller/Auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/loginAdmin", loginAdmin);
router.post("/signup", signup);
router.post("/logout", logout);

export default router;
