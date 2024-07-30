import { Category } from "../models/category.model.js";

// ADD AND UPDATE CATEGORIES -- ONLY FOR OWNERS AND ADMINS
export const addOrUpdateCategories = async (req, res) => {
  try {
    const { categories } = req.body;
    const existCategories = await Category.find();

    if (existCategories.length === 0) {
      await Category.create({ categories });
      res.status(201).json({
        message: "Added Successfully",
      });
    } else {
      await Category.findOneAndUpdate({}, { categories }, { new: true });

      res.status(201).json({
        message: "Updated Successfully",
      });
    }
  } catch (error) {
    console.log(
      "category controller error (addOrUpdateCategories) :",
      error.message,
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      categories: categories[0].categories,
    });
  } catch (error) {
    console.log("category controller error (getCategories) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
