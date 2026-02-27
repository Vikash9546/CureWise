import { Router } from "express";
import { requestAmbulance, getMyRequests, updateStatus, getAllRequests, cancelRequest } from "../controllers/ambulance.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticate, requestAmbulance);
router.get("/my", authenticate, getMyRequests);
router.patch("/:id/cancel", authenticate, cancelRequest);
router.patch("/:id/status", authenticate, authorize(["ADMIN"]), updateStatus);
router.get("/all", authenticate, authorize(["ADMIN"]), getAllRequests);

export default router;
