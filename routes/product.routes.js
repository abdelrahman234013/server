import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { isAuthenticatd } from "../middlewares/auth/isAuthenticated.js";
import { authorizeRoles } from "../middlewares/auth/authorizeRoles.js";

const productRouter = express.Router();

productRouter.post(
  "/create-product",
  isAuthenticatd,
  authorizeRoles("owner", "admin"),
  createProduct,
);

productRouter.put(
  "/update-product/:id",
  isAuthenticatd,
  authorizeRoles("owner", "admin"),
  updateProduct,
);

productRouter.delete(
  "/delete-product/:id",
  isAuthenticatd,
  authorizeRoles("owner", "admin"),
  deleteProduct,
);

productRouter.get("/get-products", getAllProducts);

productRouter.get("/get-single-product/:id", getSingleProduct);

export default productRouter;
