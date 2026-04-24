import { Router } from "express";
import { getPosts, createPost, getPostById, addComment, toggleLikePost, toggleSavePost, joinChallenge, logChallengeDay, awardPoints } from "../controllers/community.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getPosts);
router.get("/:id", authenticate, getPostById);
router.post("/", authenticate, createPost);
router.post("/:postId/comments", authenticate, addComment);
router.post("/:postId/like", authenticate, toggleLikePost);
router.post("/:postId/save", authenticate, toggleSavePost);

// Challenges & Points
router.post("/challenges/:id/join", authenticate, joinChallenge);
router.post("/challenges/:id/log", authenticate, logChallengeDay);
router.post("/points", authenticate, awardPoints);

export default router;
