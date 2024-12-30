import mongoose from "mongoose";

const ShiftWorkSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
});

const ShiftWork = mongoose.model("ShiftWork", ShiftWorkSchema);

export default ShiftWork;
