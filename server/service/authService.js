import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { comparePassword, hashedPassword } from "../utils/password.js";
import { publicUser } from "../utils/helper.js";

// Register a new user
export const registerUserService = async ({ name, email, password }) => {
  // Check whether email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("An account with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const passwordHash = await hashedPassword(password);

  // Create user
  const user = await User.create({
    name,
    email,
    password: passwordHash,
    // status defaults to Active in the User schema
  });

  // Generate JWT
  const token = generateToken(user._id);

  return {
    user: publicUser(user),
    token,
  };
};

// Login an existing user
export const loginUserService = async ({ email, password }) => {
  // Find user and include password if schema uses select: false
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  // Verify password
  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  // Check account status after verifying credentials
  const status = user.status || "Active";

  if (status !== "Active") {
    const messages = {
      Inactive: "Your account is inactive. Please contact support.",
      Suspended: "Your account has been suspended. Please contact support.",
      Pending: "Your account is pending approval.",
    };

    const error = new Error(
      messages[status] || "Your account cannot access this service.",
    );

    error.statusCode = 403;
    throw error;
  }

  // Generate JWT
  const token = generateToken(user._id);

  return {
    user: publicUser(user),
    token,
  };
};

// Get latest logged-in user information
export const getMeService = async (userId) => {
  const user = await User.findById(userId).select(
    "_id name email bio avatarUrl status createdAt",
  );

  if (!user) {
    const error = new Error("User not found. Please login again.");
    error.statusCode = 404;
    throw error;
  }

  return publicUser(user);
};
