import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", UserSchema);
