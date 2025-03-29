import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  deleted: {
    type: Boolean,
    default: false,
  }
});

const Category = mongoose.model("Category", CategorySchema);

export default Category;
