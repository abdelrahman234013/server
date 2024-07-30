import express from "express";
import { isAuthenticatd } from "../middlewares/auth/isAuthenticated.js";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { quantityChecker } from "../middlewares/quantityChecker.js";
import { authorizeRoles } from "../middlewares/auth/authorizeRoles.js";

const orderRouter = express.Router();

orderRouter.post("/create-order", quantityChecker, createOrder);

orderRouter.put(
  "/update-order-status/:id",
  isAuthenticatd,
  authorizeRoles("owner", "admin"),
  updateOrderStatus,
);

orderRouter.delete(
  "/delete-order/:id",
  isAuthenticatd,
  authorizeRoles("owner", "admin"),
  deleteOrder,
);

orderRouter.get(
  "/get-orders",
  isAuthenticatd,
  authorizeRoles("owner", "admin"),
  getAllOrders,
);

orderRouter.get(
  "/get-order/:id",
  isAuthenticatd,
  authorizeRoles("owner", "admin"),
  getOrderById,
);

orderRouter.post("/quantity-checker", quantityChecker);
export default orderRouter;
