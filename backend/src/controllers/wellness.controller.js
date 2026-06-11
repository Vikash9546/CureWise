import store from "../models/index.js";
import { addPoints } from "../services/points.service.js";

export const getWellnessPlans = async (req, res) => {
    try {
        const plans = await store.wellnessPlan.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createWellnessPlan = async (req, res) => {
    const { assessment, plan } = req.body;

    try {
        const wellnessPlan = await store.wellnessPlan.create({
            data: {
                assessment: assessment || {},
                plan: plan || {},
                userId: req.user.id
            }
        });

        // Add points for starting/completing a plan
        await addPoints(req.user.id, "COMPLETE_PLAN", wellnessPlan.id);

        const updatedUser = await store.user.findUnique({ where: { id: req.user.id } });

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
        const updated = await store.wellnessPlan.update({
            where: { id },
            data: { isActive }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
