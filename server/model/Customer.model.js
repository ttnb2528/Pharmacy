import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  gender: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  address: [
    {
      type: String,
      default: null,
    },
  ],
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
});

const Customer = mongoose.model("Customer", CustomerSchema);

export default Customer;
