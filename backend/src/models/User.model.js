import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    username: { type: String, unique: true, sparse: true },
    password: { type: String },

    role: {
      type: String,
      enum: ["ADMIN", "CUSTOMER"],
      default: "CUSTOMER",
      index: true,
    },

    firstName: String,
    lastName: String,

    points: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastStreakDate: Date,
    badges: { type: [String], default: ["beginner"] },

    // Added to match frontend DEFAULT_PROFILE
    challengesJoined: { type: [String], default: [] },
    challengesCompleted: { type: [String], default: [] },
    challengeProgress: { type: Map, of: Number, default: {} },
    
    likedPostIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", default: [] }],
    savedPostIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", default: [] }],
    
    assessment: { type: Object, default: null },
    activePlan: { type: Object, default: null },
    dailyLogs: { type: Map, of: Object, default: {} },
    customHabits: { type: [Object], default: [] },
    registeredEvents: { type: [Object], default: [] },

    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
