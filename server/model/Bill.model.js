import mongoose from "mongoose";

const BillSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["sell", "return"],
      required: true,
    },
    billIsRx: {
      type: Boolean,
      required: true,
    },
    customer: {
      customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: function () {
          return this.customer.type !== "walkin" && this.customer.type !== "business";
        },
      },
      name: {
        type: String,
        required: function () {
          return this.customer.type !== "walkin";
        },
      },
      phone: {
        type: String,
        required: function () {
          return this.customer.type !== "walkin";
        },
      },
      type: {
        type: String,
        enum: ["walkin", "loyalty", "business"],
        required: true, // Loại khách hàng - bắt buộc
      },
    },
    prescription: {
      source: {
        type: String,
        required: function () {
          return this.billIsRx;
        },
      },
      number: {
        type: String,
        required: function () {
          return this.billIsRx;
        },
      },
    },

    medicines: [
      {
        medicineId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        isRx: {
          type: Boolean,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.model("Bill", BillSchema);

export default Bill;
