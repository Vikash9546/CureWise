import store from "../models/index.js";
import mongoose from "mongoose";
import { addPoints } from "../services/points.service.js";

const SPECIALTIES = ["General", "Ayurveda", "Homeopathy", "Naturopathy", "Cardiology", "Dermatology", "Neurology", "Orthopedics", "Pediatrics", "Psychiatry", "Gynecology", "ENT", "Ophthalmology"];

export const getAllDoctors = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const { search, specialty } = req.query;

    const query = {};
    if (specialty && specialty !== 'All') {
        query.specialty = specialty;
    }
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { hospitalName: { $regex: search, $options: 'i' } },
            { city: { $regex: search, $options: 'i' } }
        ];
    }

    try {
        const [doctors, total] = await Promise.all([
            store.doctor.find(query)
                .sort({ name: 1 })
                .skip(skip)
                .limit(limit),
            store.doctor.countDocuments(query)
        ]);

        const doctorsWithId = doctors.map(doc => ({
            ...doc.toObject(),
            id: doc._id
        }));

        res.json({
            doctors: doctorsWithId,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error("Get doctors error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDoctorById = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await store.doctor.findById(id);
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });
        
        res.json({
            ...doctor.toObject(),
            id: doctor._id
        });
    } catch (error) {
        console.error("Get doctor error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createAppointment = async (req, res) => {
    const userId = req.user.id;
    const { patientName, patientAge, doctorId, slotId, notes } = req.body;
    const { simulated } = req.body;

    if (!patientName || !patientAge || !doctorId) {
        return res.status(400).json({ message: "patientName, patientAge, and doctorId are required" });
    }

    try {
        const doctor = await store.doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // If slotId is provided, verify it and mark it as booked
        if (slotId) {
            const slot = await store.doctorSlot.findById(slotId);
            if (!slot || slot.isBooked) {
                return res.status(400).json({ message: "Slot is not available" });
            }
            await store.doctorSlot.findByIdAndUpdate(slotId, { isBooked: true });
        }

        const appointment = await store.appointment.create({
            userId,
            doctorId,
            slotId: slotId || new mongoose.Types.ObjectId(),
            patientName,
            patientAge: parseInt(patientAge),
            status: simulated ? "CONFIRMED" : "PENDING",
            payment: {
                amount: doctor.consultancyFee,
                status: simulated ? "SUCCESS" : "PENDING",
                provider: simulated ? "SIMULATED" : "PENDING"
            },
        });

        // Add points for booking an appointment
        await addPoints(userId, "BOOK_APPOINTMENT", appointment._id);

        const updatedUser = await store.user.findById(userId);

        res.status(201).json({
            appointment,
            user: updatedUser ? {
                points: updatedUser.points,
                streak: updatedUser.streak,
                badges: updatedUser.badges
            } : null
        });
    } catch (error) {
        console.error("Create appointment error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMyAppointments = async (req, res) => {
    const userId = req.user.id;
    try {
        const appointments = await store.appointment.find({ userId })
            .populate('doctorId')
            .populate('slotId');
        res.json(appointments);
    } catch (error) {
        console.error("Get appointments error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const cancelAppointment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const appointment = await store.appointment.findById(id);
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });
        if (appointment.userId.toString() !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const updated = await store.appointment.findByIdAndUpdate(
            id,
            { status: "CANCELLED" },
            { new: true }
        );
        // Free up the slot
        if (appointment.slotId) {
            await store.doctorSlot.findByIdAndUpdate(appointment.slotId, { isBooked: false });
        }
        res.json(updated);
    } catch (error) {
        console.error("Cancel appointment error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await store.appointment.find()
            .populate('doctorId')
            .populate('userId')
            .populate('slotId')
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const appointment = await store.appointment.findById(id);
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });
        
        // Only the user who made the booking or an admin can delete it
        if (appointment.userId.toString() !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }

        await store.appointment.findByIdAndDelete(id);
        res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
        console.error("Delete appointment error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDoctorSlots = async (req, res) => {
    const { doctorId } = req.params;
    try {
        const slots = await store.doctorSlot.find({ doctorId, isBooked: false });
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createDoctorSlot = async (req, res) => {
    if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Admin only" });
    const { doctorId, startTime, endTime } = req.body;
    try {
        const slot = await store.doctorSlot.create({ doctorId, startTime, endTime });
        res.status(201).json(slot);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export { SPECIALTIES };
