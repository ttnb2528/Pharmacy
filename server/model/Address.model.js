import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  ward: {
    type: String,
    required: true,
  },
  provinceId: {
    type: String,
    required: true,
  },
  districtId: {
    type: String,
    required: true,
  },
  wardId: {
    type: String,
    required: true,
  },
  otherDetails: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const Address = mongoose.model("Address", AddressSchema);

export default Address;
