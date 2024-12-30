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
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const Supplier = mongoose.model("Supplier", SupplierSchema);

export default Supplier;
