import { Router } from "express";
import { getWellnessPlans, createWellnessPlan, updateWellnessPlan } from "../controllers/wellness.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getWellnessPlans);
router.post("/", authenticate, createWellnessPlan);
router.patch("/:id", authenticate, updateWellnessPlan);

export default router;
