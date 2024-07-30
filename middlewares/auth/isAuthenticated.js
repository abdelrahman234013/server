import { User } from "../../models/user.model.js";
import jwt from "jsonwebtoken";

export const isAuthenticatd = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;

    next();
  } catch (error) {
    console.log("auth middleware error (isAuthenticated) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
