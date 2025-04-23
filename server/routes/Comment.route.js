import express from "express";
import {
  createComment,
  deleteComment,
  EditComment,
  getCommentByProductId,
} from "../controller/Comment.controller.js";

const router = express.Router();

router.post("/createComment", createComment);
router.get("/getCommentByProductId/:productId", getCommentByProductId);
router.put("/editComment/:commentId", EditComment);
router.delete("/deleteComment/:commentId", deleteComment); 

export default router;
