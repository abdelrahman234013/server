import { Product } from "../models/product.model.js";
import {
  uploadProductImageService,
  deleteProductImageService,
  updateProductImageService,
} from "../services/product.service.js";

// CREATE PRODUCT -- ONLY FOR OWNERS & ADMINS
export const createProduct = async (req, res) => {
  try {
    const { data } = req.body;
    const isImgAndInfoExist = data.images.length >= 1 && data.info.length >= 1;

    if (!data.name || !data.price || !isImgAndInfoExist) {
      return res.status(400).json({ message: "Missed data" });
    }

    // HANDLE IMAGE UPLOAD
    const uploadedImgsData = await uploadProductImageService(data.images, res);

    data.images = uploadedImgsData;

    const product = await Product.create(data);

    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.log("product controller error (createProduct) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE PRODUCT -- ONLY FOR OWNERS & ADMINS
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const isImgAndInfoExist = data.images.length >= 1 && data.info.length >= 1;

    if (!data.name || !data.price || !isImgAndInfoExist) {
      return res.status(400).json({ message: "Missed data" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedImgs = await updateProductImageService(
      data.images,
      product,
      res,
    );
    data.images = updatedImgs;

    Object.assign(product, data);

    const updateProduct = await product.save();

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.log("product controller error (updateProduct) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE PRODUCT -- ONLY FOR OWNERS & ADMINS
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });

    await deleteProductImageService(product, res);
  } catch (error) {
    console.log("product controller error (deleteProduct) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .select({
        images: { $slice: 1 },
        createdAt: 0,
        updatedAt: 0,
        info: 0,
        description: 0,
      });

    res.status(200).json(products);
  } catch (error) {
    console.log("product controller error (getAllProducts) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.log("product controller error (getSingleProduct) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
