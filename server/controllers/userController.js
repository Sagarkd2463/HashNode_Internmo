import mongoose from "mongoose";
import {
  getPublicProfileService,
  updateMyProfileService,
} from "../service/userService.js";

// Validate email
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate avatar URL
const isValidAvatarUrl = (value) => {
  if (!value) return true;

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

// Get public profile
export const getPublicProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate user ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const result = await getPublicProfileService(id);

    return res.status(200).json({
      success: true,
      message: "Public profile fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Update logged-in user's profile
export const updateMyProfile = async (req, res, next) => {
  try {
    const { name, email, bio, avatarUrl } = req.body || {};

    const updates = {};

    // Prevent restricted or unexpected fields
    const allowedFields = ["name", "email", "bio", "avatarUrl"];

    const invalidFields = Object.keys(req.body || {}).filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `These fields cannot be updated: ${invalidFields.join(", ")}`,
      });
    }

    // Validate name
    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        name.trim().length < 2 ||
        name.trim().length > 80
      ) {
        return res.status(400).json({
          success: false,
          message: "Name must be between 2 and 80 characters.",
        });
      }

      updates.name = name.trim();
    }

    // Validate email
    if (email !== undefined) {
      if (typeof email !== "string") {
        return res.status(400).json({
          success: false,
          message: "Email must be a string.",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address.",
        });
      }

      updates.email = normalizedEmail;
    }

    // Validate bio
    if (bio !== undefined) {
      if (typeof bio !== "string" || bio.trim().length > 200) {
        return res.status(400).json({
          success: false,
          message: "Bio must be 200 characters or fewer.",
        });
      }

      updates.bio = bio.trim();
    }

    // Validate avatar URL
    if (avatarUrl !== undefined) {
      if (
        typeof avatarUrl !== "string" ||
        avatarUrl.trim().length > 2048 ||
        !isValidAvatarUrl(avatarUrl.trim())
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid HTTP or HTTPS avatar URL.",
        });
      }

      updates.avatarUrl = avatarUrl.trim();
    }

    // Check empty updates
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update.",
      });
    }

    // Update profile
    const user = await updateMyProfileService(req.user._id, updates);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
          status: user.status,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    // Handle duplicate email
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    next(error);
  }
};
