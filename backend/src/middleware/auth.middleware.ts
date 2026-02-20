import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Access denied" });
        }
        next();
    };
};
