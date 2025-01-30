import mongoose from "mongoose";

const PointHistorySchema = new mongoose.Schema({
  AccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  change: {
    // Thay đổi điểm (số dương là tích lũy, số âm là sử dụng)
    type: Number,
    required: true,
  },
  createdAt: {
    // Thời điểm thay đổi
    type: Date,
    default: Date.now,
  },
  description: {
    // Mô tả (ví dụ: "Tích điểm từ đơn hàng ORD001")
    type: String,
  },
});

const PointHistory = mongoose.model("PointHistory", PointHistorySchema);

export default PointHistory;
