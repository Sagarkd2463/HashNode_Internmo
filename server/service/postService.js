import mongoose from "mongoose";
import Post from "../models/Post.js";
import Tag from "../models/Tag.js";
import { populatePost, getTags, createSlug } from "../utils/helper.js";
import { makeExcerpt, slugify } from "../utils/slug.js";

// Escape special regex characters
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Get all published posts
export const getPublishedPostsService = async ({ search, tag }) => {
  const filter = {
    status: "published",
  };

  if (search?.trim()) {
    filter.title = {
      $regex: escapeRegex(search.trim()),
      $options: "i",
    };
  }

  if (tag?.trim()) {
    const tagDocument = await Tag.findOne({
      slug: slugify(tag.trim()),
    });

    if (!tagDocument) {
      return [];
    }

    filter.tags = tagDocument._id;
  }

  const posts = await populatePost(
    Post.find(filter).sort({
      publishedAt: -1,
      createdAt: -1,
    }),
  );

  return posts;
};

// Get a published post by slug
export const getPostBySlugService = async (slug) => {
  const post = await populatePost(
    Post.findOne({
      slug,
      status: "published",
    }),
  );

  if (!post) {
    throw Error("Post not found.", 404);
  }

  return post;
};

// Get logged-in user's posts
export const getMyPostsService = async (userId) => {
  const posts = await populatePost(
    Post.find({
      author: userId,
    }).sort({
      updatedAt: -1,
    }),
  );

  return posts;
};

// Create a post
export const createPostService = async ({
  title,
  content,
  excerpt,
  coverImage = "",
  status = "draft",
  tags = [],
  authorId,
}) => {
  const postExcerpt = excerpt?.trim() || makeExcerpt(content);

  const post = await Post.create({
    title: title.trim(),
    slug: await createSlug(title.trim()),
    content,
    excerpt: postExcerpt,
    coverImage: coverImage.trim(),
    status,
    author: authorId,
    tags: await getTags(tags),
    publishedAt: status === "published" ? new Date() : null,
  });

  const result = await populatePost(Post.findById(post._id));

  return result;
};

// Update a post
export const updatePostService = async (postId, userId, updates) => {
  if (!mongoose.isValidObjectId(postId)) {
    throw Error("Invalid post ID.");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw Error("Post not found.");
  }

  if (!post.author.equals(userId)) {
    throw Error("You can only edit your own posts.");
  }

  const { title, content, excerpt, coverImage, status, tags } = updates;

  // Update title and slug
  if (title !== undefined) {
    post.title = title.trim();

    post.slug = await createSlug(post.title, post._id);
  }

  // Update content
  if (content !== undefined) {
    post.content = content;
  }

  // Update excerpt
  if (excerpt !== undefined) {
    post.excerpt = excerpt.trim() ? excerpt.trim() : makeExcerpt(post.content);
  } else if (content !== undefined) {
    post.excerpt = makeExcerpt(post.content);
  }

  // Update cover image
  if (coverImage !== undefined) {
    post.coverImage = coverImage.trim();
  }

  // Update publication status
  if (status !== undefined) {
    if (status === "draft") {
      post.publishedAt = null;
    } else if (post.status !== "published") {
      post.publishedAt = new Date();
    }

    post.status = status;
  }

  // Update tags
  if (tags !== undefined) {
    post.tags = await getTags(tags);
  }

  await post.save();

  const result = await populatePost(Post.findById(post._id));

  return result;
};

// Delete a post
export const deletePostService = async (postId, userId) => {
  if (!mongoose.isValidObjectId(postId)) {
    throw Error("Invalid post ID.");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw Error("Post not found.");
  }

  if (!post.author.equals(userId)) {
    throw Error("You can only delete your own posts.");
  }

  await post.deleteOne();

  return true;
};
