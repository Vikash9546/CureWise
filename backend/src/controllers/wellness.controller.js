import prisma from "../utils/prisma";

export const getWellnessPlans = async (req, res) => {
    try {
        const plans = await prisma.wellnessPlan.findMany({
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
        const wellnessPlan = await prisma.wellnessPlan.create({
            data: {
                assessment,
                plan,
                userId: req.user.id
            }
        });
        res.status(201).json(wellnessPlan);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateWellnessPlan = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
        const updated = await prisma.wellnessPlan.update({
            where: { id, userId: req.user.id },
            data: { isActive }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
