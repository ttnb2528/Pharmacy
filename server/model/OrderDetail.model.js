import mongoose from "mongoose";

const OrderDetailSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const OrderDetail = mongoose.model("OrderDetail", OrderDetailSchema);

export default OrderDetail;
