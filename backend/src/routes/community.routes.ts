import { Router } from "express";
import { getPosts, createPost, getPostById, addComment, toggleLikePost } from "../controllers/community.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", authenticate, createPost);
router.post("/:postId/comments", authenticate, addComment);
router.post("/:postId/like", authenticate, toggleLikePost);

export default router;
