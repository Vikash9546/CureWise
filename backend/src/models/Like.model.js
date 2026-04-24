import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    targetType: {
      type: String,
      enum: ["POST", "COMMENT"],
      required: true,
    },
  },
  { timestamps: true }
);

// prevent duplicate likes
likeSchema.index(
  { userId: 1, targetId: 1, targetType: 1 },
  { unique: true }
);

const Like = mongoose.model("Like", likeSchema);
export default Like;
