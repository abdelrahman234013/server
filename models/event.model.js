import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventProductImg: {
      type: Object,
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    usersList: {
      type: Array,
      default: [],
    },

    eventStatus: {
      type: String,
      enum: ["Live", "Over"],
      default: "Live",
    },

    winnerClient: {
      type: Object,
      default: null,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Event = mongoose.model("Event", eventSchema);
