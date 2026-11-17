import express from "express";

import {
  getPublishedPosts,
  getPostBySlug,
  getMyPosts,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes

// Get all published posts (search and filter by tag)
router.get("/", getPublishedPosts);

// Protected routes (login required)

// Get logged-in user's posts
router.get("/mine", authMiddleware, getMyPosts);

// Get a published post by slug (keep after /mine so it cannot capture it)
router.get("/:slug", getPostBySlug);

// Create a new post
router.post("/", authMiddleware, createPost);

// Update a post
router.put("/:id", authMiddleware, updatePost);

// Delete a post
router.delete("/:id", authMiddleware, deletePost);

export default router;
