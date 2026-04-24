import store from "../models/index.js";
import mongoose from "mongoose";
import { addPoints } from "../services/points.service.js";

export const getWellnessPlans = async (req, res) => {
    try {
        const plans = await store.wellness.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createWellnessPlan = async (req, res) => {
    const { assessment, plan } = req.body;

    try {
        const wellnessPlan = await store.wellness.create({
            assessment,
            plan,
            userId: req.user.id
        });

        // Add points for starting/completing a plan (adjusting logic as needed)
        await addPoints(req.user.id, "COMPLETE_PLAN", wellnessPlan._id);

        const updatedUser = await store.user.findById(req.user.id);

        res.status(201).json({
            wellnessPlan,
            user: updatedUser ? {
                points: updatedUser.points,
                streak: updatedUser.streak,
                badges: updatedUser.badges
            } : null
        });
    } catch (error) {
        console.error("Create wellness plan error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateWellnessPlan = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
        const updated = await store.wellness.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { isActive },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
