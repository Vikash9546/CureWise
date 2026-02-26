import { Router } from "express";
import { getWellnessPlans, createWellnessPlan, updateWellnessPlan } from "../controllers/wellness.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, getWellnessPlans);
router.post("/", authenticate, createWellnessPlan);
router.patch("/:id", authenticate, updateWellnessPlan);

export default router;
