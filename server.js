// PACKAGES IMPORT
import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

// CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// FILES IMPORT
import { connectToMongoDB } from "./utils/db/connectDB.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import eventRoutes from "./routes/event.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

// DEFINING VARIABLES
const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARES
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  }),
);

// ROUTES
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// STARTING SERVER
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectToMongoDB();
});
