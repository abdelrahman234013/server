import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userInfo: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    shippingAddress: {
      type: Object,
      required: true,
    },

    orderItems: {
      type: Array,
      required: true,
    },

    orderStatus: {
      type: String,
      enum: ["Confirmed", "Shipped", "Delivered", "Canceled"],
      default: "Confirmed",
    },

    orderNumber: {
      type: Number,
      required: true,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    totalQty: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        enum: ["paid", "unpaid"],
        required: true,
      },
    },

    paidAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Ensure only for new documents
    const maxValue = await this.constructor
      .findOne()
      .sort({ orderNumber: -1 })
      .select("orderNumber"); // Get current highest value
    this.orderNumber = maxValue ? maxValue.orderNumber + 1 : 1; // Handle initial value
  }
  next();
});

orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    if (this.paymentMethod.status === "paid") {
      this.paidAt = Date.now();
    }
  }
  next();
});

export const Order = mongoose.model("Order", orderSchema);
