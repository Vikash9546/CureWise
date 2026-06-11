import store from "../models/index.js";

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
    // Ensure IDs are strings
    if (!userId || typeof userId !== 'string') {
      console.warn(`Invalid userId for point award: ${userId}`);
      return;
    }
    if (!referenceId || typeof referenceId !== 'string') {
      console.warn(`Invalid referenceId for point award: ${referenceId}`);
      return;
    }

    // 1. Log the points to prevent double reward
    await store.pointLog.create({
      data: {
        userId,
        actionType,
        points,
        referenceId
      }
    });

    // 4. Update user points and check for badges
    const user = await store.user.findUnique({
      where: { id: userId }
    });
    if (!user) return;

    const oldPoints = user.points;
    const newPoints = oldPoints + points;
    const earnedBadges = Array.isArray(user.badges) ? [...user.badges] : [];

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
      const likedPostIds = Array.isArray(user.likedPostIds) ? user.likedPostIds : [];
      checkBadge('heartgiver', likedPostIds.length >= 10);
    }
    
    if (actionType === "COMMENT") {
      const commentCount = await store.pointLog.count({
        where: { userId, actionType: "COMMENT" }
      });
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
    await store.user.update({
      where: { id: userId },
      data: {
        points: { increment: points },
        badges: earnedBadges
      }
    });

    console.log(`Points updated for user ${userId}: ${oldPoints} -> ${newPoints}`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log(`User ${userId} already received points for ${actionType} on ${referenceId}`);
      return;
    }
    console.error(`Error adding points for ${actionType}:`, error.message);
  }
};

export default {
  addPoints,
  POINTS_MAP
};
