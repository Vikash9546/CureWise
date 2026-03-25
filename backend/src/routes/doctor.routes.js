import { Router } from "express";
import { createAppointment, getMyAppointments, cancelAppointment, deleteAppointment, getAllAppointments, getAllDoctors, getDoctorById } from "../controllers/doctor.controller.js";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/razorpay.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getAllDoctors);
router.post("/", authenticate, createAppointment);
router.get("/my", authenticate, getMyAppointments);
router.get("/:id", authenticate, getDoctorById);
router.delete("/:id", authenticate, deleteAppointment);
router.get("/all", authenticate, authorize(["ADMIN"]), getAllAppointments);

// Razorpay Routes
router.post("/payment/order", authenticate, createRazorpayOrder);
router.post("/payment/verify", authenticate, verifyRazorpayPayment);

export default router;
