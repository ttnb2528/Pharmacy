import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
});

const Brand = mongoose.model("Brand", BrandSchema);

export default Brand;
