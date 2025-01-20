import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  coupon_code: { type: String, required: true, unique: true },
  description: String,
  discount_type: {
    type: String,
    enum: ["percentage", "fixed_amount"],
    required: true,
  },
  discount_value: { type: Number, required: true },
  minimum_order_value: Number,
  quantity: Number,
  maximum_uses: Number,
  start_date: Date,
  end_date: Date,
  status: {
    type: String,
    enum: ["active", "inactive", "expired"],
    default: "active",
  },
});

const Coupon = mongoose.model("Coupon", CouponSchema);

export default Coupon;
