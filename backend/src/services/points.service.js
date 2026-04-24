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

    // 4. Update user points and check for badges
  const user = await store.user.findById(uId);
  if (!user) return;

  const oldPoints = user.points;
  const newPoints = oldPoints + points;
  const earnedBadges = [...user.badges];

  // --- Auto Badge Logic ---
  const checkBadge = (id, condition) => {
    if (condition && !earnedBadges.includes(id)) {
      earnedBadges.push(id);
      console.log(`Badge Awarded: ${id}`);
    }
  };

  // Points-based badges
  checkBadge('explorer', newPoints >= 200);
  checkBadge('mentor', newPoints >= 800);
  checkBadge('healer', newPoints >= 2000);

  // Engagement-based badges
  if (actionType === "LIKE_POST") {
    checkBadge('heartgiver', user.likedPostIds.length >= 10);
  }
  
  if (actionType === "COMMENT") {
    // We can estimate comment count or add a field. 
    // For now, let's use points as a proxy or just check if it's their 5th comment point log
    const commentCount = await store.pointLog.countDocuments({ userId: uId, actionType: "COMMENT" });
    checkBadge('helper', commentCount >= 5);
  }

  if (actionType === "DAILY_STREAK") {
    checkBadge('streak7', user.streak >= 7);
    checkBadge('streak30', user.streak >= 30);
  }

  if (actionType === "JOIN_CHALLENGE") {
    checkBadge('challenger', true);
  }

  // Update User
  await store.user.findByIdAndUpdate(uId, {
    $inc: { points: points },
    $set: { badges: earnedBadges }
  });

  console.log(`Points updated for user ${uId}: ${oldPoints} -> ${newPoints}`);
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
