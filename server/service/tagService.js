import Tag from "../models/Tag.js";
import Post from "../models/Post.js";
import { slugify } from "../utils/slug.js";
import { populatePost } from "../utils/helper.js";

// Get all tags with published post counts
export const getTagsService = async () => {
  const tags = await Tag.aggregate([
    {
      $lookup: {
        from: "posts",
        let: { tagId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ["$$tagId", "$tags"] },
                  { $eq: ["$status", "published"] },
                ],
              },
            },
          },
          { $count: "count" },
        ],
        as: "postStats",
      },
    },
    {
      $addFields: {
        postCount: {
          $ifNull: [{ $arrayElemAt: ["$postStats.count", 0] }, 0],
        },
      },
    },
    {
      $project: {
        postStats: 0,
      },
    },
    { $sort: { name: 1 } },
  ]);

  return tags;
};

// Create a tag
export const createTagService = async (name) => {
  const normalizedName = name.trim().toLowerCase();
  const slug = slugify(normalizedName);

  if (!slug) {
    const error = new Error("Invalid tag name.");
    error.statusCode = 400;
    throw error;
  }

  let tag = await Tag.findOne({ slug });

  if (tag) {
    return { tag, created: false };
  }

  try {
    tag = await Tag.create({
      name: normalizedName,
      slug,
    });

    return { tag, created: true };
  } catch (error) {
    // Handle duplicate slug errors
    if (error.code !== 11000) {
      throw error;
    }

    tag = await Tag.findOne({ slug });

    return { tag, created: false };
  }
};

// Get published posts by tag slug
export const getPostsByTagService = async (slug) => {
  const tag = await Tag.findOne({ slug });

  if (!tag) {
    return null;
  }

  const posts = await populatePost(
    Post.find({
      tags: tag._id,
      status: "published",
    }).sort({
      publishedAt: -1,
      createdAt: -1,
    }),
  );

  return {
    tag,
    posts,
    count: posts.length,
  };
};
