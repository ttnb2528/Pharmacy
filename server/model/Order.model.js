import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  AccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  nameCustomer: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: [
      "pending",
      "shipping",
      "packaged",
      "processing",
      "completed",
      "cancelled",
    ],
    default: "pending",
  },
  type: {
    type: String,
    required: true,
    enum: ["online", "store"],
  },
  address: {
    type: String,
    required: true,
  },
  coupon: {
    type: String,
    default: null,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["COD", "PAYPAL", "VNPAY"],
  },
  totalTemp: {
    type: Number,
    required: true,
  },
  shippingFee: {
    type: Number,
    default: 0,
  },
  discountValue: {
    type: Number,
    default: 0,
  },
  discountProduct: {
    type: Number,
    default: 0,
  },
  note: {
    type: String,
    required: false,
  },
  paypalOrderId: {
    type: String,
    default: null,
  },
  paypalCaptureId: {
    type: String,
    default: null,
  },
  paypalPaymentStatus: {
    type: String,
    default: null,
  },
  vnpTxnRef: String,
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
