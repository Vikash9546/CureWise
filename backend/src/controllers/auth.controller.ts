import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import { OAuth2Client } from "google-auth-library";
import { AuthRequest } from "../middleware/auth.middleware";

// Use placeholder for now. The user will replace this in .env
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);


export const register = async (req: Request, res: Response) => {
    const { email, password, role, firstName, lastName, username } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Check if username is already taken
        if (username) {
            const existingUsername = await prisma.user.findUnique({ where: { username } });
            if (existingUsername) {
                return res.status(400).json({ message: "Username is already taken" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                username: username || null,
                password: hashedPassword,
                role: role || "CUSTOMER",
            },
        });

        res.status(201).json({ message: "User created successfully", userId: user.id });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            return res.status(401).json({ message: "Invalid credentials or account uses Google Sign-In" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "24h" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                points: user.points,
                streak: user.streak,
                badges: user.badges,
                lastStreakDate: user.lastStreakDate,
                likedPostIds: user.likedPostIds,
                savedPostIds: user.savedPostIds,
                name: user.username || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email),
                activeWellnessPlan: await prisma.wellnessPlan.findFirst({
                    where: { userId: user.id, isActive: true },
                    orderBy: { createdAt: 'desc' }
                })
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            points: user.points,
            streak: user.streak,
            badges: user.badges,
            lastStreakDate: user.lastStreakDate,
            likedPostIds: user.likedPostIds,
            savedPostIds: user.savedPostIds,
            name: user.username || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email),
            activeWellnessPlan: await prisma.wellnessPlan.findFirst({
                where: { userId: user.id, isActive: true },
                orderBy: { createdAt: 'desc' }
            })
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    const { username, firstName, lastName, points, streak, badges, lastStreakDate, likedPostIds, savedPostIds } = req.body;

    try {
        // Check if username is already taken by another user
        if (username) {
            const existingUsername = await prisma.user.findUnique({ where: { username } });
            if (existingUsername && existingUsername.id !== req.user!.id) {
                return res.status(400).json({ message: "Username is already taken" });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user!.id },
            data: {
                ...(username !== undefined && { username: username || null }),
                ...(firstName !== undefined && { firstName }),
                ...(lastName !== undefined && { lastName }),
                ...(points !== undefined && { points: parseInt(points) }),
                ...(streak !== undefined && { streak: parseInt(streak) }),
                ...(badges !== undefined && { badges }),
                ...(lastStreakDate !== undefined && { lastStreakDate: lastStreakDate ? new Date(lastStreakDate) : null }),
                ...(likedPostIds !== undefined && { likedPostIds }),
                ...(savedPostIds !== undefined && { savedPostIds }),
            },
        });

        res.json({
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            username: updatedUser.username,
            points: updatedUser.points,
            streak: updatedUser.streak,
            badges: updatedUser.badges,
            lastStreakDate: updatedUser.lastStreakDate,
            likedPostIds: updatedUser.likedPostIds,
            savedPostIds: updatedUser.savedPostIds,
            name: updatedUser.username || (updatedUser.firstName && updatedUser.lastName ? `${updatedUser.firstName} ${updatedUser.lastName}` : updatedUser.email),
            activeWellnessPlan: await prisma.wellnessPlan.findFirst({
                where: { userId: updatedUser.id, isActive: true },
                orderBy: { createdAt: 'desc' }
            })
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const googleLogin = async (req: Request, res: Response) => {
    const { credential } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(401).json({ message: "Invalid Google Token" });
        }

        const email = payload.email;
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Create user without password since they use Google
            user = await prisma.user.create({
                data: {
                    email,
                    firstName: payload.given_name,
                    lastName: payload.family_name,
                    role: "CUSTOMER",
                },
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "24h" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                points: user.points,
                streak: user.streak,
                badges: user.badges,
                lastStreakDate: user.lastStreakDate,
                likedPostIds: user.likedPostIds,
                savedPostIds: user.savedPostIds,
                name: user.username || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email),
                activeWellnessPlan: await prisma.wellnessPlan.findFirst({
                    where: { userId: user.id, isActive: true },
                    orderBy: { createdAt: 'desc' }
                })
            },
        });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: "Internal server error during Google Sign-In" });
    }
};
