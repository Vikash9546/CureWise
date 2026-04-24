import store from "../models/index.js";

export const requestAmbulance = async (req, res) => {
    const userId = req.user.id;
    const { patientName, location, contactNumber, emergencyType, notes } = req.body;

    if (!patientName || !location || !contactNumber || !emergencyType) {
        return res.status(400).json({ message: "patientName, location, contactNumber, and emergencyType are required" });
    }

    try {
        const booking = await store.ambulance.create({
            userId,
            patientName,
            location,
            contactNumber,
            emergencyType,
            status: "REQUESTED",
        });

        // Add points for requesting an ambulance (if desired, let's add a small amount or just sync user)
        // For now, let's just fetch user to sync points if any are added
        const updatedUser = await store.user.findById(userId);

        res.status(201).json({
            booking,
            user: {
                points: updatedUser.points,
                streak: updatedUser.streak,
                badges: updatedUser.badges
            }
        });
    } catch (error) {
        console.error("Ambulance request error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMyRequests = async (req, res) => {
    const userId = req.user.id;
    try {
        const bookings = await store.ambulance.find({ userId }).sort({ createdAt: -1 });
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
    const validStatuses = ["REQUESTED", "DISPATCHED", "COMPLETED"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }
    try {
        const updated = await store.ambulance.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        console.error("Update ambulance status error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllRequests = async (req, res) => {
    try {
        const bookings = await store.ambulance.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const cancelRequest = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const booking = await store.ambulance.findById(id);
        if (!booking) return res.status(404).json({ message: "Request not found" });

        // Only original user or admin can cancel
        if (booking.userId.toString() !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const updated = await store.ambulance.findByIdAndUpdate(
            id,
            { status: "CANCELLED" },
            { new: true }
        );

        res.json(updated);
    } catch (error) {
        console.error("Cancel ambulance request error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteRequest = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const booking = await store.ambulance.findById(id);
        if (!booking) return res.status(404).json({ message: "Request not found" });

        // Only original user or admin can delete
        if (booking.userId.toString() !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await store.ambulance.findByIdAndDelete(id);

        res.json({ message: "Ambulance request deleted successfully" });
    } catch (error) {
        console.error("Delete ambulance request error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

