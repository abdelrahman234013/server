import { Product } from "../models/product.model.js";

export const quantityChecker = async (req, res, next) => {
  try {
    const { orderItems } = req.body;
    let insufficientStock = false;
    let unexistProduct = false;
    let checkedProducts = [];

    for (const orderedProduct of orderItems) {
      const product = await Product.findById(orderedProduct.id);

      if (!product) {
        unexistProduct = true;
        return res.status(400).json({ message: "Product does not exist" });
      }

      for (const [index, item] of product.info.entries()) {
        if (item.size === orderedProduct.size) {
          if (item.quantity < orderedProduct.quantity) {
            insufficientStock = true;
            return res
              .status(400)
              .json({ message: "Not enough product in stock" });
          }

          product.info[index].quantity -= orderedProduct.quantity;

          checkedProducts.push(product);
        }
      }
    }

    if (insufficientStock || unexistProduct) {
      return;
    }

    req.products = checkedProducts;
    next();
  } catch (error) {
    console.log("quantityChecker middleware error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
