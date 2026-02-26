import prisma from "../utils/prisma";

export const requestAmbulance = async (req, res) => {
    const userId = req.user.id;
    const { patientName, location, contactNumber, emergencyType, notes } = req.body;

    if (!patientName || !location || !contactNumber || !emergencyType) {
        return res.status(400).json({ message: "patientName, location, contactNumber, and emergencyType are required" });
    }

    try {
        const booking = await prisma.ambulanceBooking.create({
            data: {
                userId,
                patientName,
                location,
                contactNumber,
                emergencyType,
                notes: notes || null,
                status: "REQUESTED",
            },
        });
        res.status(201).json(booking);
    } catch (error) {
        console.error("Ambulance request error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMyRequests = async (req, res) => {
    const userId = req.user.id;
    try {
        const bookings = await prisma.ambulanceBooking.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        res.json(bookings);
    } catch (error) {
        console.error("Get ambulance requests error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateStatus = async (req, res) => {
    if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Admin only" });
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["REQUESTED", "DISPATCHED", "ARRIVED", "COMPLETED"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }
    try {
        const updated = await prisma.ambulanceBooking.update({
            where: { id },
            data: { status },
        });
        res.json(updated);
    } catch (error) {
        console.error("Update ambulance status error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllRequests = async (req, res) => {
    try {
        const bookings = await prisma.ambulanceBooking.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const cancelRequest = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const booking = await prisma.ambulanceBooking.findUnique({ where: { id } });
        if (!booking) return res.status(404).json({ message: "Request not found" });

        // Only original user or admin can cancel
        if (booking.userId !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const updated = await prisma.ambulanceBooking.update({
            where: { id },
            data: { status: "CANCELLED" },
        });

        res.json(updated);
    } catch (error) {
        console.error("Cancel ambulance request error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
