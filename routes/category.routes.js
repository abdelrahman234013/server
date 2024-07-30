import express from "express";
import {
  addOrUpdateCategories,
  getCategories,
} from "../controllers/category.controller.js";
import { isAuthenticatd } from "../middlewares/auth/isAuthenticated.js";
import { authorizeRoles } from "../middlewares/auth/authorizeRoles.js";

const categoryRouter = express.Router();

categoryRouter.post(
  "/add-categories",
  isAuthenticatd,
  authorizeRoles("owner", "admin"),
  addOrUpdateCategories,
);

categoryRouter.get("/get-categories", getCategories);

export default categoryRouter;
