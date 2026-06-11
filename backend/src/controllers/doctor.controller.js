import store from "../models/index.js";
import { addPoints } from "../services/points.service.js";

const SPECIALTIES = ["General", "Ayurveda", "Homeopathy", "Naturopathy", "Cardiology", "Dermatology", "Neurology", "Orthopedics", "Pediatrics", "Psychiatry", "Gynecology", "ENT", "Ophthalmology"];

export const getAllDoctors = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const { search, specialty, sortBy } = req.query;

    const where = {};
    if (specialty && specialty !== 'All') {
        where.specialty = specialty;
    }
    if (search) {
        where.OR = [
            { name: { contains: search } },
            { hospitalName: { contains: search } },
            { city: { contains: search } }
        ];
    }

    let orderBy = { name: 'asc' };
    if (sortBy) {
        switch (sortBy) {
            case "price_asc":
                orderBy = { consultancyFee: 'asc' };
                break;
            case "price_desc":
                orderBy = { consultancyFee: 'desc' };
                break;
            case "experience_asc":
                orderBy = { experience: 'asc' };
                break;
            case "experience_desc":
                orderBy = { experience: 'desc' };
                break;
            case "rating_asc":
                orderBy = { rating: 'asc' };
                break;
            case "rating_desc":
                orderBy = { rating: 'desc' };
                break;
            case "name":
                orderBy = { name: 'asc' };
                break;
            default:
                orderBy = { name: 'asc' };
        }
    }

    try {
        const [doctors, total] = await Promise.all([
            store.doctorProfile.findMany({
                where,
                orderBy,
                skip,
                take: limit,
            }),
            store.doctorProfile.count({ where })
        ]);

        const doctorsWithId = doctors.map(doc => ({
            ...doc,
            id: doc.id
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
        const doctor = await store.doctorProfile.findUnique({ where: { id } });
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });
        
        res.json({
            ...doctor,
            id: doctor.id
        });
    } catch (error) {
        console.error("Get doctor error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createAppointment = async (req, res) => {
    const userId = req.user.id;
    const { patientName, patientAge, doctorId, slotId, notes, appointmentDate } = req.body;
    const { simulated } = req.body;

    if (!patientName || !patientAge || !doctorId) {
        return res.status(400).json({ message: "patientName, patientAge, and doctorId are required" });
    }

    try {
        const doctor = await store.doctorProfile.findUnique({ where: { id: doctorId } });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // If slotId is provided, verify it and mark it as booked
        if (slotId) {
            const slot = await store.doctorSlot.findUnique({ where: { id: slotId } });
            if (!slot || slot.isBooked) {
                return res.status(400).json({ message: "Slot is not available" });
            }
            await store.doctorSlot.update({
                where: { id: slotId },
                data: { isBooked: true }
            });
        }

        const appointment = await store.appointment.create({
            data: {
                userId,
                doctorProfileId: doctorId,
                slotId: slotId || null,
                patientName,
                patientAge: parseInt(patientAge),
                appointmentDate: appointmentDate ? new Date(appointmentDate) : null,
                status: simulated ? "CONFIRMED" : "PENDING",
                payment: {
                    amount: doctor.consultancyFee,
                    status: simulated ? "SUCCESS" : "PENDING",
                    provider: simulated ? "SIMULATED" : "PENDING"
                }
            }
        });

        // Create normalized Payment record
        await store.payment.create({
            data: {
                appointmentId: appointment.id,
                amount: doctor.consultancyFee,
                status: simulated ? "SUCCESS" : "PENDING",
                provider: simulated ? "SIMULATED" : "PENDING"
            }
        });

        // Add points for booking an appointment
        await addPoints(userId, "BOOK_APPOINTMENT", appointment.id);

        const updatedUser = await store.user.findUnique({ where: { id: userId } });

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
        const appointments = await store.appointment.findMany({
            where: { userId },
            include: {
                doctorProfile: true,
                slot: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const mappedAppointments = appointments.map(apt => ({
            ...apt,
            doctorId: apt.doctorProfile,
            slotId: apt.slot
        }));

        res.json(mappedAppointments);
    } catch (error) {
        console.error("Get appointments error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const cancelAppointment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const appointment = await store.appointment.findUnique({ where: { id } });
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });
        if (appointment.userId !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const updated = await store.appointment.update({
            where: { id },
            data: { status: "CANCELLED" }
        });

        await store.payment.updateMany({
            where: { appointmentId: id },
            data: { status: "FAILED" }
        });

        if (appointment.slotId) {
            await store.doctorSlot.update({
                where: { id: appointment.slotId },
                data: { isBooked: false }
            });
        }
        res.json(updated);
    } catch (error) {
        console.error("Cancel appointment error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await store.appointment.findMany({
            include: {
                doctorProfile: true,
                user: true,
                slot: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const mappedAppointments = appointments.map(apt => ({
            ...apt,
            doctorId: apt.doctorProfile,
            userId: apt.user,
            slotId: apt.slot
        }));

        res.json(mappedAppointments);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const appointment = await store.appointment.findUnique({ where: { id } });
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });
        
        if (appointment.userId !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }

        await store.appointment.delete({ where: { id } });
        res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
        console.error("Delete appointment error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDoctorSlots = async (req, res) => {
    const { doctorId } = req.params;
    try {
        const slots = await store.doctorSlot.findMany({
            where: { doctorProfileId: doctorId, isBooked: false }
        });
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createDoctorSlot = async (req, res) => {
    if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Admin only" });
    const { doctorId, startTime, endTime } = req.body;
    try {
        const slot = await store.doctorSlot.create({
            data: {
                doctorProfileId: doctorId,
                startTime: new Date(startTime),
                endTime: new Date(endTime)
            }
        });
        res.status(201).json(slot);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export { SPECIALTIES };
