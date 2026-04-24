import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import store from "../models/index.js";
import mongoose from "mongoose";
import { addPoints } from "../services/points.service.js";
import { OAuth2Client } from "google-auth-library";

// Use placeholder for now. The user will replace this in .env
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);


export const register = async (req, res) => {
    const { email, password, role, firstName, lastName, username } = req.body;

    try {
        const existingUser = await store.user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Check if username is already taken
        if (username) {
            const existingUsername = await store.user.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ message: "Username is already taken" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await store.user.create({
            email,
            firstName,
            lastName,
            username: username || null,
            password: hashedPassword,
            role: role || "CUSTOMER",
        });

        res.status(201).json({ message: "User created successfully", userId: user.id });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await store.user.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({ message: "Invalid credentials or account uses Google Sign-In" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Streak Logic
        const now = new Date();
        const lastDate = user.lastStreakDate ? new Date(user.lastStreakDate) : null;
        let newStreak = user.streak || 0;
        let shouldReward = false;

        if (!lastDate) {
            newStreak = 1;
            shouldReward = true;
        } else {
            const diffTime = Math.abs(now - lastDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                newStreak += 1;
                shouldReward = true;
            } else if (diffDays > 1) {
                newStreak = 1;
                shouldReward = true;
            }
            // If diffDays === 0 (same day), do nothing
        }

        if (shouldReward) {
            user.streak = newStreak;
            user.lastStreakDate = now;
            await user.save();
            await addPoints(user._id, "STREAK_BONUS", user._id);
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
                challengesJoined: user.challengesJoined || [],
                challengesCompleted: user.challengesCompleted || [],
                challengeProgress: user.challengeProgress || {},
                likedPostIds: user.likedPostIds || [],
                savedPostIds: user.savedPostIds || [],
                name: user.username || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email),
                activeWellnessPlan: await store.wellness.findOne({ userId: user.id, isActive: true }).sort({ createdAt: -1 })
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await store.user.findById(req.user.id);
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
            challengesJoined: user.challengesJoined || [],
            challengesCompleted: user.challengesCompleted || [],
            challengeProgress: user.challengeProgress || {},
            likedPostIds: user.likedPostIds || [],
            savedPostIds: user.savedPostIds || [],
            name: user.username || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email),
            activeWellnessPlan: await store.wellness.findOne({ userId: user.id, isActive: true }).sort({ createdAt: -1 })
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    const { username, firstName, lastName, points, streak, badges, lastStreakDate, likedPostIds, savedPostIds, registeredEvents } = req.body;

    try {
        // Check if username is already taken by another user
        if (username) {
            const existingUsername = await store.user.findOne({ username });
            if (existingUsername && existingUsername._id.toString() !== req.user.id) {
                return res.status(400).json({ message: "Username is already taken" });
            }
        }

        const updatedUser = await store.user.findByIdAndUpdate(
            req.user.id,
            {
                ...(username !== undefined && { username: username || null }),
                ...(firstName !== undefined && { firstName }),
                ...(lastName !== undefined && { lastName }),
                ...(points !== undefined && { points: parseInt(points) }),
                ...(streak !== undefined && { streak: parseInt(streak) }),
                ...(badges !== undefined && { badges }),
                ...(lastStreakDate !== undefined && { lastStreakDate: lastStreakDate ? new Date(lastStreakDate) : null }),
                ...(likedPostIds !== undefined && { likedPostIds }),
                ...(savedPostIds !== undefined && { savedPostIds }),
                ...(registeredEvents !== undefined && { registeredEvents }),
                ...(req.body.challengesJoined !== undefined && { challengesJoined: req.body.challengesJoined }),
                ...(req.body.challengesCompleted !== undefined && { challengesCompleted: req.body.challengesCompleted }),
                ...(req.body.challengeProgress !== undefined && { challengeProgress: req.body.challengeProgress }),
            },
            { new: true }
        );

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
            challengesJoined: updatedUser.challengesJoined || [],
            challengesCompleted: updatedUser.challengesCompleted || [],
            challengeProgress: updatedUser.challengeProgress || {},
            likedPostIds: updatedUser.likedPostIds || [],
            savedPostIds: updatedUser.savedPostIds || [],
            name: updatedUser.username || (updatedUser.firstName && updatedUser.lastName ? `${updatedUser.firstName} ${updatedUser.lastName}` : updatedUser.email),
            activeWellnessPlan: await store.wellness.findOne({ userId: updatedUser.id, isActive: true }).sort({ createdAt: -1 })
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const googleLogin = async (req, res) => {
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
        let user = await store.user.findOne({ email });

        if (!user) {
            // Create user without password since they use Google
            user = await store.user.create({
                email,
                firstName: payload.given_name,
                lastName: payload.family_name,
                role: "CUSTOMER",
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
                challengesJoined: user.challengesJoined || [],
                challengesCompleted: user.challengesCompleted || [],
                challengeProgress: user.challengeProgress || {},
                likedPostIds: user.likedPostIds || [],
                savedPostIds: user.savedPostIds || [],
                name: user.username || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email),
                activeWellnessPlan: await store.wellness.findOne({ userId: user.id, isActive: true }).sort({ createdAt: -1 })
            },
        });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: "Internal server error during Google Sign-In" });
    }
};
