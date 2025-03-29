import mongoose from "mongoose";

const ManufactureSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const Manufacture = mongoose.model("Manufacture", ManufactureSchema);

export default Manufacture;
