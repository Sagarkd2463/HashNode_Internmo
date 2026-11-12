import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    excerpt: {
      type: String,
      maxlength: 250,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

postSchema.index({
  status: 1,
  publishedAt: -1,
});

postSchema.index({
  author: 1,
  updatedAt: -1,
});

const Post = mongoose.model("Post", postSchema);

export default Post;
