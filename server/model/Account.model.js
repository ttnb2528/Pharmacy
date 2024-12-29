import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const AccountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide a email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

AccountSchema.pre("save", async function (next) {
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

const Account = mongoose.model("Account", AccountSchema);

export default Account;
