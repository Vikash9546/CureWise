import mongoose from "mongoose";

const pointLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actionType: {
      type: String,
      required: true,
      enum: ["LIKE_POST", "COMMENT", "BOOK_APPOINTMENT", "COMPLETE_PLAN", "STREAK_BONUS"],
    },
    points: {
      type: Number,
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId, // ID of the Post, Comment, or Appointment
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate points for the same action on the same reference item
pointLogSchema.index({ userId: 1, actionType: 1, referenceId: 1 }, { unique: true });

const PointLog = mongoose.model("PointLog", pointLogSchema);
export default PointLog;
