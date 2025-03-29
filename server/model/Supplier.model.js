import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    // required: true,
    default: "",
  },
  phone: {
    type: String,
    // required: true,
    default: "",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const Supplier = mongoose.model("Supplier", SupplierSchema);

export default Supplier;
