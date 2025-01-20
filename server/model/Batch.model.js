import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  batchNumber: {
    type: String,
    required: true,
  },
  dateOfEntry: {
    type: Date,
    required: true,
  },
  dateOfManufacture: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
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
  retailPrice: {
    type: Number,
    required: true,
  },
  SupplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  ManufactureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manufacture",
    required: true,
  },
  MedicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true,
  },
});

const Batch = mongoose.model("Batch", BatchSchema);

export default Batch;
