import mongoose from "mongoose";

const MedicineSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  instruction: {
    type: String,
    required: true,
  },
  uses: {
    //công dụng
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  packaging: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      default: null,
    },
  ],
  effect: {
    type: String,
    required: true,
  },
  isRx: {
    type: Boolean,
    required: true,
  },
  drugUser: {
    type: String,
    required: true,
  },
  quantityStock: {
    type: Number,
    required: true,
    default: 0,
  },
  isDiscount: {
    type: Boolean,
    default: false,
  },
  percentDiscount: {
    type: Number,
    default: 0,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  batches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
    },
  ],
});

const Medicine = mongoose.model("Medicine", MedicineSchema);

export default Medicine;
