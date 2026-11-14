import {
  registerUserService,
  loginUserService,
  getMeService,
} from "../service/authService.js";

// Email validation
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Register
export const registerUser = async (req, res) => {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";

    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const password =
      typeof req.body?.password === "string" ? req.body.password : "";

    // Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    // Name validation
    if (name.length < 2 || name.length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 80 characters.",
      });
    }

    // Email validation
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Password validation
    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 8 and 128 characters.",
      });
    }

    const result = await registerUserService({
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "User account registered successfully.",
      data: result,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error.message);

    // Duplicate email protection, including concurrent requests
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Internal server error during registration.",
    });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const password =
      typeof req.body?.password === "string" ? req.body.password : "";

    // Required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Email validation
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const result = await loginUserService({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Internal server error during login.",
    });
  }
};

// Get currently logged-in user
export const getMe = async (req, res) => {
  try {
    const user = await getMeService(req.user._id);

    return res.status(200).json({
      success: true,
      message: "User information fetched successfully.",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("GET ME ERROR:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Could not fetch user information.",
    });
  }
};
