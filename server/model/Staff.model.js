import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const StaffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },

    gender: {
      type: String,
      default: null,
    },

    date: {
      type: Date,
      default: null,
    },

    phone: {
      type: String,
      default: null,
    },

    address: {
      type: String,
      default: null,
    },

    username: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    workDate: {
      type: Date,
      default: Date.now,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

StaffSchema.pre("save", async function (next) {
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

const Staff = mongoose.model("Staff", StaffSchema);

export default Staff;
