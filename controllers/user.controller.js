import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { createToken } from "../utils/token/createToken.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // NO NEED IN THIS PROJECT TO SEND EMAIL ACTIVATION
    // const activationToken = createActivationToken(req.body);
    // const { emailToken } = activationToken;
    // const data = { user: { name }, emailToken };
    // try {
    //   await sendMail({
    //     emails: [email],
    //     subject: "Account Activation",
    //     template: "activation.mail.ejs",
    //     data,
    //   });

    //   res.status(201).json({
    //     message: `Activation code sent to your email`,
    //     token: activationToken.token,
    //   });
    // } catch (error) {
    //   console.log("user controller error (register-sendMail) :", error.message);
    //   res.status(500).json({ message: "Internal Server Error" });
    // }
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      createToken(user, 201, res);
    }
  } catch (error) {
    console.log("user controller error (register) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    createToken(user, 200, res);
  } catch (error) {
    console.log("user controller error (login) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// SOCIAL AUTH
export const socialAuth = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "Email and name are required" });
    }

    const userExist = await User.findOne({ email });

    if (!userExist) {
      const user = await User.create({ email, name });

      createToken(user, 201, res);
    } else {
      createToken(userExist, 200, res);
    }
  } catch (error) {
    console.log("user controller error (socialAuth) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("user controller error (logout) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET USER INFO (TO CHECK IF IS LOGGED IN OR NOT)
export const getUserInfo = async (req, res) => {
  try {
    const { user } = req;

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.log("user controller error (getUserInfo) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ADD ADMIN -- ONLY FOR OWNERS
export const addAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const currentUser = req.user;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found please make the user signup first" });
    }

    if (currentUser.email === user.email) {
      return res
        .status(400)
        .json({ message: "You can't add yourself as admin" });
    }

    if (user.role === "owner") {
      return res.status(400).json({ message: "You can't add owner as admin" });
    }

    user.role = "admin";

    await user.save();

    res.status(200).json({
      message: "New admin added successfully",
    });
  } catch (error) {
    console.log("user controller error (addAdmin) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// REMOVE ADMIN -- ONLY FOR OWNERS
export const removeAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "admin") {
      return res.status(400).json({ message: "User is not an admin" });
    }

    user.role = "user";

    await user.save();

    res.status(200).json({
      message: "User role updated successfully",
    });
  } catch (error) {
    console.log("user controller error (removeAdmin) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ALL ADMINS -- ONLY FOR OWNERS & ADMINS
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).sort({ createdAt: -1 });
    res.status(200).json(admins);
  } catch (error) {
    console.log("user controller error (getAllAdmins) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ALL USERS -- ONLY FOR OWNERS & ADMINS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.log("user controller error (getAllUsers) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE USER -- ONLY FOR OWNERS & ADMINS
export const deleteUser = async (req, res) => {
  try {
    const {id}  = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("user controller error (deleteUser) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// VERIFY EMAIL NO NEED TO THIS CONTROLLER IN THIS PROJECT
// export const verifyEmail = async (req, res) => {
//   try {
//     const { emailToken, token } = req.body;

//     const decoded = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);

//     if (decoded.emailToken !== emailToken) {
//       return res.status(400).json({ message: "Invalid email token" });
//     }

//     const { name, email, password } = decoded.user;

//     const salt = await bcrypt.genSalt(10);

//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     if (newUser) {
//       createToken(newUser._id, res);
//       res.status(201).json({
//         _id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//       });
//     }
//   } catch (error) {
//     console.log("user controller error (verifyEmail) :", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
