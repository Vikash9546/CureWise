import Razorpay from "razorpay";
import crypto from "crypto";
import store from "../models/index.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder_id",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_test_placeholder_secret",
});

export const createRazorpayOrder = async (req, res) => {
    const { amount, appointmentId } = req.body;

    if (!amount || !appointmentId) {
        return res.status(400).json({ message: "Amount and appointmentId are required" });
    }

    if (process.env.RAZORPAY_KEY_ID?.includes("placeholder") || process.env.RAZORPAY_KEY_SECRET?.includes("placeholder")) {
        return res.status(400).json({
            message: "Razorpay API keys are not configured. Please replace the placeholders in your .env file with real test keys from Razorpay Dashboard."
        });
    }

    try {
        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paise
            currency: "INR",
            receipt: `receipt_${appointmentId}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error("Razorpay order error:", error);
        res.status(500).json({ message: "Failed to create payment order" });
    }
};

export const verifyRazorpayPayment = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        appointmentId
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "rzp_test_placeholder_secret")
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        try {
            // Update appointment status to CONFIRMED and payment to SUCCESS
            await store.appointment.findByIdAndUpdate(
                appointmentId,
                {
                    status: "CONFIRMED",
                    "payment.status": "SUCCESS",
                    "payment.transactionId": razorpay_payment_id,
                    "payment.provider": "RAZORPAY"
                }
            );

            res.status(200).json({ message: "Payment verified successfully" });
        } catch (error) {
            console.error("Payment verification update error:", error);
            res.status(500).json({ message: "Payment verified but failed to update appointment" });
        }
    } else {
        res.status(400).json({ message: "Invalid payment signature" });
    }
};
