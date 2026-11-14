import mongoose from "mongoose";
import Post from "../models/Post.js";
import Tag from "../models/Tag.js";
import { slugify } from "../utils/slug.js";

// Return safe user information (never return password)
export const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  bio: user.bio || "",
  avatarUrl: user.avatarUrl || "",
  status: user.status || "Active",
  createdAt: user.createdAt,
});

// Include author and tag information in post responses
export const populatePost = (query) => {
  return query
    .populate("author", "name bio avatarUrl")
    .populate("tags", "name slug");
};

// Find or create tags
export const getTags = async (tagValues = []) => {
  if (!Array.isArray(tagValues)) {
    const error = new Error("Tags must be an array.");
    error.statusCode = 400;
    throw error;
  }

  const tagIds = [];

  for (const value of tagValues) {
    if (typeof value !== "string") {
      const error = new Error("Each tag must be a string.");
      error.statusCode = 400;
      throw error;
    }

    const normalized = value.trim();

    if (!normalized) continue;

    let tag;

    if (mongoose.isValidObjectId(normalized)) {
      tag = await Tag.findById(normalized);

      if (!tag) {
        const error = new Error("Selected tag does not exist.");
        error.statusCode = 400;
        throw error;
      }
    } else {
      const name = normalized.toLowerCase();

      if (name.length > 40) {
        const error = new Error("Each tag must be 40 characters or fewer.");
        error.statusCode = 400;
        throw error;
      }

      const slug = slugify(name);

      if (!slug) continue;

      tag = await Tag.findOne({ slug });

      if (!tag) {
        try {
          tag = await Tag.create({ name, slug });
        } catch (error) {
          if (error.code !== 11000) throw error;

          tag = await Tag.findOne({ slug });
        }
      }
    }

    if (tag && !tagIds.some((id) => id.equals(tag._id))) {
      tagIds.push(tag._id);
    }

    if (tagIds.length > 10) {
      const error = new Error("A post can have a maximum of 10 tags.");
      error.statusCode = 400;
      throw error;
    }
  }

  return tagIds;
};

// Generate a unique slug
export const createSlug = async (title, postId = null) => {
  const baseSlug = slugify(title);

  if (!baseSlug) {
    const error = new Error("Title must contain letters or numbers.");
    error.statusCode = 400;
    throw error;
  }

  let slug = baseSlug;
  let count = 2;

  while (
    await Post.exists({
      slug,
      ...(postId && {
        _id: { $ne: postId },
      }),
    })
  ) {
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
};
