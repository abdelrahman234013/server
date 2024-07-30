import express from "express";
import { quantityChecker } from "../middlewares/quantityChecker.js";
import { createPayment } from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-payment", createPayment);

export default paymentRouter;
