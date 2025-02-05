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
  timeSlots: [
    {
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    },
  ],
  overtimeThreshold: {
    type: Number,
    default: 4,
    max: 4,
  },
  overtimeRate: {
    type: Number,
    default: 1.5,
  },
  capacity: {
    type: Number,
    required: true,
  },
});

const ShiftWork = mongoose.model("ShiftWork", ShiftWorkSchema);

export default ShiftWork;
