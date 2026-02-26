import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const getWellnessPlans = async (req: AuthRequest, res: Response) => {
    try {
        const plans = await prisma.wellnessPlan.findMany({
            where: { userId: req.user!.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createWellnessPlan = async (req: AuthRequest, res: Response) => {
    const { assessment, plan } = req.body;

    try {
        const wellnessPlan = await prisma.wellnessPlan.create({
            data: {
                assessment,
                plan,
                userId: req.user!.id
            }
        });
        res.status(201).json(wellnessPlan);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateWellnessPlan = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
        const updated = await prisma.wellnessPlan.update({
            where: { id, userId: req.user!.id },
            data: { isActive }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
