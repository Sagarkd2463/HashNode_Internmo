import {
  getTagsService,
  createTagService,
  getPostsByTagService,
} from "../service/tagService.js";

// GET /api/tags
export const getTags = async (req, res, next) => {
  try {
    const tags = await getTagsService();

    return res.status(200).json({
      success: true,
      data: { tags },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/tags
export const createTag = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Validate tag name
    if (typeof name !== "string" || !name.trim() || name.trim().length > 40) {
      return res.status(400).json({
        success: false,
        message: "Tag name must be between 1 and 40 characters.",
      });
    }

    const result = await createTagService(name);

    return res.status(result.created ? 201 : 200).json({
      success: true,
      message: result.created
        ? "Tag created successfully."
        : "Tag already exists.",
      data: {
        tag: result.tag,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/tags/:slug/posts
export const getPostsByTag = async (req, res, next) => {
  try {
    const result = await getPostsByTagService(req.params.slug);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Tag not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
