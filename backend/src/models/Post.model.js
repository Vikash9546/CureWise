import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    authorName: String, // denormalized
    authorAvatar: String,

    type: { type: String, enum: ["STORY", "DISCUSSION"] },
    category: { type: String, index: true },

    title: String,
    content: String,

    tags: [{ type: String, index: true }],

    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },

    isAnonymous: { type: Boolean, default: false },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });

const Post = mongoose.model("Post", postSchema);
export default Post;
