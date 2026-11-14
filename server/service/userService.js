import User from "../models/User.js";
import Post from "../models/Post.js";

// Get public user profile
export const getPublicProfileService = async (userId) => {
  const user = await User.findById(userId).select(
    "name bio avatarUrl createdAt",
  );

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  // Only published posts are visible publicly
  const posts = await Post.find({
    author: userId,
    status: "published",
  })
    .select("-__v")
    .populate("tags", "name slug")
    .sort({ publishedAt: -1, createdAt: -1 });

  return {
    user,
    posts,
    count: posts.length,
  };
};

// Update logged-in user's profile
export const updateMyProfileService = async (userId, updates) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: updates,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select("_id name email bio avatarUrl status createdAt");

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  return user;
};
