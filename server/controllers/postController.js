import {
  getPublishedPostsService,
  getPostBySlugService,
  getMyPostsService,
  createPostService,
  updatePostService,
  deletePostService,
} from "../service/postService.js";

// Get all published posts
export const getPublishedPosts = async (req, res, next) => {
  try {
    const { search, tag } = req.query;

    const posts = await getPublishedPostsService({
      search,
      tag,
    });

    return res.status(200).json({
      success: true,
      data: {
        posts,
        count: posts.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a published post by slug
export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await getPostBySlugService(req.params.slug);

    return res.status(200).json({
      success: true,
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

// Get logged-in user's posts
export const getMyPosts = async (req, res, next) => {
  try {
    const posts = await getMyPostsService(req.user._id);

    return res.status(200).json({
      success: true,
      data: {
        posts,
        count: posts.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create a post
export const createPost = async (req, res, next) => {
  try {
    const {
      title,
      content,
      excerpt,
      coverImage = "",
      status = "draft",
      tags = [],
    } = req.body;

    // Validate title and content
    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.trim().length > 180 ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid title and content are required.",
      });
    }

    // Validate status
    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be draft or published.",
      });
    }

    // Validate tags
    if (!Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        message: "Tags must be an array.",
      });
    }

    // Validate cover image
    if (
      typeof coverImage !== "string" ||
      (coverImage.trim() && !/^https?:\/\/\S+$/i.test(coverImage.trim()))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid cover image URL.",
      });
    }

    // Validate excerpt
    if (
      excerpt !== undefined &&
      (typeof excerpt !== "string" || excerpt.trim().length > 250)
    ) {
      return res.status(400).json({
        success: false,
        message: "Excerpt must be 250 characters or fewer.",
      });
    }

    const post = await createPostService({
      title,
      content,
      excerpt,
      coverImage,
      status,
      tags,
      authorId: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

// Update a post
export const updatePost = async (req, res, next) => {
  try {
    const { title, content, excerpt, coverImage, status, tags } = req.body;

    // Validate title
    if (title !== undefined) {
      if (
        typeof title !== "string" ||
        !title.trim() ||
        title.trim().length > 180
      ) {
        return res.status(400).json({
          success: false,
          message: "Title must be between 1 and 180 characters.",
        });
      }
    }

    // Validate content
    if (content !== undefined) {
      if (typeof content !== "string" || !content.trim()) {
        return res.status(400).json({
          success: false,
          message: "Content cannot be empty.",
        });
      }
    }

    // Validate excerpt
    if (excerpt !== undefined) {
      if (typeof excerpt !== "string" || excerpt.trim().length > 250) {
        return res.status(400).json({
          success: false,
          message: "Excerpt must be 250 characters or fewer.",
        });
      }
    }

    // Validate cover image
    if (coverImage !== undefined) {
      if (
        typeof coverImage !== "string" ||
        (coverImage.trim() && !/^https?:\/\/\S+$/i.test(coverImage.trim()))
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid cover image URL.",
        });
      }
    }

    // Validate status
    if (status !== undefined && !["draft", "published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post status.",
      });
    }

    // Validate tags
    if (tags !== undefined && !Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        message: "Tags must be an array.",
      });
    }

    const post = await updatePostService(req.params.id, req.user._id, req.body);

    return res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

// Delete a post
export const deletePost = async (req, res, next) => {
  try {
    await deletePostService(req.params.id, req.user._id);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
