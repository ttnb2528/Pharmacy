import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    batchNumber: {
      type: String,
      required: true,
    },
    dateOfEntry: {
      type: Date,
      required: true,
    },
    dateOfManufacture: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    // Thêm trường mới để lưu số lượng ban đầu
    initialQuantity: {
      type: Number,
      default: function () {
        return this.quantity;
      },
    },
    price: {
      type: Number,
      required: true,
    },
    retailPrice: {
      type: Number,
      required: true,
    },
    SupplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    ManufactureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manufacture",
      required: true,
    },
    MedicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    isExpiredHandled: {
      type: Boolean,
      default: false,
    },
    // Thêm trường mới để lưu thông tin người cập nhật
    updatedBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
      name: String,
      timestamp: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Batch = mongoose.model("Batch", BatchSchema);

export default Batch;
