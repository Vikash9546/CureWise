import mongoose from "mongoose";

const wellnessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    assessment: mongoose.Schema.Types.Mixed,
    plan: mongoose.Schema.Types.Mixed,

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const WellnessPlan = mongoose.model("WellnessPlan", wellnessSchema);
export default WellnessPlan;
