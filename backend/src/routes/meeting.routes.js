import { Router } from "express";
import { createMeeting, getMyMeetings, cancelMeeting } from "../controllers/meeting.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, createMeeting);
router.get("/my", authenticate, getMyMeetings);
router.patch("/:id/cancel", authenticate, cancelMeeting);

export default router;
