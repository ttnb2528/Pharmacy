import mongoose from "mongoose";

const CouponUsageSchema = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    required: true,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  usageCount: {
    type: Number,
    default: 1,
  },
  lastUsedDate: {
    type: Date,
    default: Date.now,
  },
});

const CouponUsage = mongoose.model("CouponUsage", CouponUsageSchema);

export default CouponUsage;
