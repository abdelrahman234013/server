import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },

    images: Array,
    inEvent: {
      type: Boolean,
      default: false,
    },

    category: {
      type: String,
      default: "",
    },
    inStock: {
      type: Boolean,
    },
    info: [
      {
        size: String,
        quantity: Number,
        inStock: {
          type: Boolean,
          default: function () {
            return this.quantity > 0;
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

productSchema.pre("save", function (next) {
  // Update status for all items in info array
  this.info.forEach((item) => (item.inStock = item.quantity > 0));
  this.inStock = this.info.some((item) => item.inStock);

  next();
});

export const Product = mongoose.model("Product", productSchema);
