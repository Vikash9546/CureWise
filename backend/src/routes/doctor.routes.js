import { Router } from "express";
import { createAppointment, getMyAppointments, cancelAppointment, getAllAppointments, getAllDoctors, getDoctorById } from "../controllers/doctor.controller";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/razorpay.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, getAllDoctors);
router.post("/", authenticate, createAppointment);
router.get("/my", authenticate, getMyAppointments);
router.get("/:id", authenticate, getDoctorById);
router.patch("/:id/cancel", authenticate, cancelAppointment);
router.get("/all", authenticate, authorize(["ADMIN"]), getAllAppointments);

// Razorpay Routes
router.post("/payment/order", authenticate, createRazorpayOrder);
router.post("/payment/verify", authenticate, verifyRazorpayPayment);

export default router;
