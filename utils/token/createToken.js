import jwt from "jsonwebtoken";
// import crypto from "crypto";

export const createToken = (user, statusCode, res) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  res.status(statusCode).json({
    user: {
      name: user.name,
      email: user.email,
      _id: user._id,
      role: user.role,
    },
  });
};

// export const createActivationToken = (user) => {
//   const emailToken = crypto.randomBytes(64).toString("hex");

//   const token = jwt.sign(
//     { user, emailToken },
//     process.env.ACTIVATION_TOKEN_SECRET,
//     {
//       expiresIn: "5m",
//     },
//   );

//   return { emailToken, token };
// };
