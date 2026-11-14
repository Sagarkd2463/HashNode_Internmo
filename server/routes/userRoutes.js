import express from "express";

import {
  getPublicProfile,
  updateMyProfile,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get public user profile
router.get("/:id", getPublicProfile);

// Update logged-in user's profile
router.patch("/me", authMiddleware, updateMyProfile);

export default router;
