import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categories: [String],
});

export const Category = mongoose.model("Category", categorySchema);
