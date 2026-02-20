import { Response } from "express";
import prisma from "../utils/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

const SPECIALTIES = ["General", "Ayurveda", "Homeopathy", "Naturopathy", "Cardiology", "Dermatology", "Neurology", "Orthopedics", "Pediatrics", "Psychiatry", "Gynecology", "ENT", "Ophthalmology"];

export const getAllDoctors = async (req: AuthRequest, res: Response) => {
    try {
        const doctors = await prisma.doctor.findMany({
            orderBy: { name: "asc" },
        });
        res.json(doctors);
    } catch (error) {
        console.error("Get doctors error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDoctorById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const doctor = await prisma.doctor.findUnique({ where: { id } });
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });
        res.json(doctor);
    } catch (error) {
        console.error("Get doctor error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createAppointment = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { patientName, patientAge, doctorId, appointmentDate, notes } = req.body;

    if (!patientName || !patientAge || !doctorId || !appointmentDate) {
        return res.status(400).json({ message: "patientName, patientAge, doctorId, and appointmentDate are required" });
    }

    try {
        const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        const { simulated } = req.body;

        const appointment = await prisma.doctorAppointment.create({
            data: {
                userId,
                doctorId,
                patientName,
                patientAge: parseInt(patientAge),
                specialty: doctor.specialty,
                appointmentDate: new Date(appointmentDate),
                notes: notes || null,
                paymentStatus: simulated ? "COMPLETED" : "PENDING",
                paymentAmount: doctor.consultancyFee,
                status: simulated ? "CONFIRMED" : "PENDING",
            },
        });
        res.status(201).json(appointment);
    } catch (error) {
        console.error("Create appointment error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMyAppointments = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    try {
        const appointments = await prisma.doctorAppointment.findMany({
            where: { userId },
            include: { doctor: true },
            orderBy: { appointmentDate: "asc" },
        });
        res.json(appointments);
    } catch (error) {
        console.error("Get appointments error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const cancelAppointment = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    try {
        const appointment = await prisma.doctorAppointment.findUnique({ where: { id } });
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });
        if (appointment.userId !== userId && req.user!.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const updated = await prisma.doctorAppointment.update({
            where: { id },
            data: { status: "CANCELLED" },
        });
        res.json(updated);
    } catch (error) {
        console.error("Cancel appointment error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllAppointments = async (req: AuthRequest, res: Response) => {
    try {
        const appointments = await prisma.doctorAppointment.findMany({
            include: { doctor: true, user: true },
            orderBy: { createdAt: "desc" },
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export { SPECIALTIES };
