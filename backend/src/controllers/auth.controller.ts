import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import { OAuth2Client } from "google-auth-library";

// Use placeholder for now. The user will replace this in .env
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);


export const register = async (req: Request, res: Response) => {
    const { email, password, role, firstName, lastName } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
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
            user: { id: user.id, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMe = async (req: any, res: Response) => {
    res.json(req.user);
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
            user: { id: user.id, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: "Internal server error during Google Sign-In" });
    }
};
