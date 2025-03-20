import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const AccountSchema = new mongoose.Schema({
  email: {
    type: String,
    // required: [true, "Please provide a email"],
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    // required: [true, "Please provide a password"],
    minlength: 6,
  },
  cartData: {
    type: Object,
  },
  loyaltyProgramId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LoyaltyProgram",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

AccountSchema.pre("save", async function (next) {
  if (!this.password) {
    return next(); // Bỏ qua nếu không có password
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

const Account = mongoose.model("Account", AccountSchema);

export default Account;
