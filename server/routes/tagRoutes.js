import express from "express";

import {
  getTags,
  createTag,
  getPostsByTag,
} from "../controllers/tagController.js";

const router = express.Router();

// Get all tags with published post counts
router.get("/", getTags);

// Create a new tag
router.post("/", createTag);

// Get published posts by tag slug
router.get("/:slug/posts", getPostsByTag);

export default router;
