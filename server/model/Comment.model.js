import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String, // URL của hình ảnh
        default: null,
      },
    ],
    isToxic: {
      type: Boolean,
      default: false,
    },
    warning: {
      type: String,
      default: null,
    },
    editCount: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Đảm bảo chỉ có 1 bình luận mỗi user cho mỗi sản phẩm
CommentSchema.index({ productId: 1, userId: 1 }, { unique: true });

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
