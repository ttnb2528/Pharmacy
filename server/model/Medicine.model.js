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
});

const Medicine = mongoose.model("Medicine", MedicineSchema);

export default Medicine;
