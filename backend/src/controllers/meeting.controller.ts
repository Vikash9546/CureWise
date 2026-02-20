import { Response } from "express";
import prisma from "../utils/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// Jitsi Meet deep-link: opens a custom room instantly for both participants
const generateMeetLink = (): string => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const segment = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `https://meet.jit.si/Appointly_Room_${segment(8)}`;
};

export const createMeeting = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { title, description, meetingDate, duration, type, invitees } = req.body;

    if (!title || !meetingDate) {
        return res.status(400).json({ message: "title and meetingDate are required" });
    }

    const meetLink = type === "audio" ? null : generateMeetLink();

    try {
        const meeting = await prisma.meeting.create({
            data: {
                userId,
                title,
                description: description || null,
                meetingDate: new Date(meetingDate),
                duration: duration || 30,
                type: type || "video",
                meetLink,
                invitees: invitees || [],
                status: "SCHEDULED",
            },
        });
        res.status(201).json(meeting);
    } catch (error) {
        console.error("Create meeting error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMyMeetings = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    try {
        const meetings = await prisma.meeting.findMany({
            where: { userId },
            orderBy: { meetingDate: "asc" },
        });
        res.json(meetings);
    } catch (error) {
        console.error("Get meetings error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const cancelMeeting = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    try {
        const meeting = await prisma.meeting.findUnique({ where: { id } });
        if (!meeting) return res.status(404).json({ message: "Meeting not found" });
        if (meeting.userId !== userId) return res.status(403).json({ message: "Forbidden" });

        const updated = await prisma.meeting.update({
            where: { id },
            data: { status: "CANCELLED" },
        });
        res.json(updated);
    } catch (error) {
        console.error("Cancel meeting error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
