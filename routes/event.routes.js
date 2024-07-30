import express from "express";
import { isAuthenticatd } from "../middlewares/auth/isAuthenticated.js";
import { authorizeRoles } from "../middlewares/auth/authorizeRoles.js";
import {
  createEvent,
  deleteEvent,
  getAdminEvents,
  getAdminSingleEvent,
  getUserEvent,
  stopEvent,
  updateEvent,
} from "../controllers/event.controller.js";

const eventRouter = express.Router();

eventRouter.post(
  "/create-event",
  isAuthenticatd,
  authorizeRoles("owner", "admin"),
  createEvent,
);

eventRouter.put("/stop-event/:id", stopEvent);

eventRouter.get(
  "/get-admin-events",
  isAuthenticatd,
  authorizeRoles("owner", "admin"),
  getAdminEvents,
);

eventRouter.get(
  "/get-admin-event/:id",
  isAuthenticatd,
  authorizeRoles("owner", "admin"),
  getAdminSingleEvent,
);

eventRouter.get("/get-user-event", getUserEvent);

eventRouter.put(
  "/update-event/:id",
  isAuthenticatd,
  authorizeRoles("owner", "admin"),
  updateEvent,
);

eventRouter.delete(
  "/delete-event/:id",
  isAuthenticatd,
  authorizeRoles("owner", "admin"),
  deleteEvent,
);

export default eventRouter;
