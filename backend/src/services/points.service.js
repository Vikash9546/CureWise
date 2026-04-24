import store from "../models/index.js";
import mongoose from "mongoose";

const POINTS_MAP = {
  LIKE_POST: 2,
  UNLIKE_POST: -2,
  SAVE_POST: 3,
  UNSAVE_POST: -3,
  COMMENT: 5,
  CREATE_DISCUSSION: 10,
  SHARE_STORY: 15,
  JOIN_CHALLENGE: 5,
  LOG_CHALLENGE_DAY: 10,
  COMPLETE_CHALLENGE: 50,
  DAILY_STREAK: 5,
  BOOK_APPOINTMENT: 50, // Standard reward for medical engagement
  COMPLETE_PLAN: 30     // Standard reward for wellness completion
};

/**
 * Service to add points to a user.
 * 
 * @param {string} userId - ID of the user to reward
 * @param {string} actionType - Type of action from POINTS_MAP
 * @param {string} referenceId - ID of the target object (Post, Comment, etc.)
 */
export const addPoints = async (userId, actionType, referenceId) => {
  const points = POINTS_MAP[actionType] || 0;

  if (points <= 0) return;

  try {
    // Ensure IDs are valid ObjectIds to prevent CastErrors
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.warn(`Invalid userId for point award: ${userId}`);
      return;
    }
    if (!referenceId || !mongoose.Types.ObjectId.isValid(referenceId)) {
      console.warn(`Invalid referenceId for point award: ${referenceId}`);
      return;
    }

    const uId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    const rId = typeof referenceId === 'string' ? new mongoose.Types.ObjectId(referenceId) : referenceId;

    // 1. Log the points to prevent double reward
    await store.pointLog.create({
      userId: uId,
      actionType,
      points,
      referenceId: rId
    });

    // 2. Increment the user's points
    await store.user.updateOne(
      { _id: uId },
      { $inc: { points } }
    );
    
    console.log(`Added ${points} points to user ${userId} for ${actionType}`);
  } catch (error) {
    if (error.code === 11000) {
      console.log(`User ${userId} already received points for ${actionType} on ${referenceId}`);
      return;
    }
    console.error(`Error adding points for ${actionType}:`, error.message);
    // We don't throw to avoid breaking the main operation
  }
};

export default {
  addPoints,
  POINTS_MAP
};
