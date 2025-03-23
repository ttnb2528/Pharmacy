import mongoose from "mongoose";

const LoyaltyProgramSchema = new mongoose.Schema({
  AccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
    unique: true, // Đảm bảo mỗi khách hàng chỉ có một bản ghi LoyaltyProgram
  },
  points: {
    type: Number,
    default: 0,
  },
  rank: {
    type: String,
    enum: ["Bạc", "Vàng", "Kim cương"],
    default: "Bạc",
  },
  totalSpending: {
    // Tổng chi tiêu tích lũy
    type: Number,
    default: 0,
  },
  lastResetDate: {
    type: Date,
    default: () => new Date(new Date().getFullYear(), 0, 1), // Mặc định là đầu năm hiện tại
  },
});

const LoyaltyProgram = mongoose.model("LoyaltyProgram", LoyaltyProgramSchema);

export default LoyaltyProgram;
