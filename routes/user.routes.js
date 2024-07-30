import express from "express";
import {
  addAdmin,
  deleteUser,
  getAllAdmins,
  getAllUsers,
  getUserInfo,
  login,
  logout,
  register,
  removeAdmin,
  socialAuth,
} from "../controllers/user.controller.js";
import { isAuthenticatd } from "../middlewares/auth/isAuthenticated.js";
import { authorizeRoles } from "../middlewares/auth/authorizeRoles.js";

const userRouter = express.Router();

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.post("/social-auth", socialAuth);

userRouter.post("/logout", isAuthenticatd, logout);

userRouter.get("/me", isAuthenticatd, getUserInfo);

userRouter.put("/add-admin", isAuthenticatd, authorizeRoles("owner"), addAdmin);

userRouter.put(
  "/remove-admin",
  isAuthenticatd,
  authorizeRoles("owner"),
  removeAdmin,
);

userRouter.get(
  "/get-admins",
  isAuthenticatd,
  authorizeRoles("owner", "admin"),
  getAllAdmins,
);

userRouter.get(
  "/get-users",
  isAuthenticatd,
  authorizeRoles("owner", "admin"),
  getAllUsers,
);

userRouter.delete(
  "/delete-user/:id",
  isAuthenticatd,
  authorizeRoles("owner", "admin"),
  deleteUser,
);

export default userRouter;
