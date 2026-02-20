import request from "supertest";
import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "../routes/auth.routes";
import slotRoutes from "../routes/slot.routes";
import bookingRoutes from "../routes/booking.routes";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || "file:./dev.db",
        },
    },
});
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);

describe("Appointment System Integration Tests", () => {
    let adminToken: string;
    let customerToken: string;
    let customer2Token: string;
    let adminId: number;
    let customerId: number;
    let customer2Id: number;

    beforeAll(async () => {
        // Clear DB
        await prisma.booking.deleteMany();
        await prisma.slot.deleteMany();
        await prisma.user.deleteMany();

        // Create users
        const admin = await prisma.user.create({
            data: { email: "admin@test.com", password: "password", role: "ADMIN" }
        });
        const customer = await prisma.user.create({
            data: { email: "customer@test.com", password: "password", role: "CUSTOMER" }
        });
        const customer2 = await prisma.user.create({
            data: { email: "customer2@test.com", password: "password", role: "CUSTOMER" }
        });

        adminId = admin.id;
        customerId = customer.id;
        customer2Id = customer2.id;

        adminToken = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET || "secret");
        customerToken = jwt.sign({ id: customer.id, email: customer.email, role: customer.role }, process.env.JWT_SECRET || "secret");
        customer2Token = jwt.sign({ id: customer2.id, email: customer2.email, role: customer2.role }, process.env.JWT_SECRET || "secret");
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    test("1. Admin can create a slot and Customer can book it successfully", async () => {
        const startTime = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
        const endTime = new Date(Date.now() + 7200000).toISOString(); // 2 hours from now

        // Admin creates slot
        const slotRes = await request(app)
            .post("/api/slots")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ startTime, endTime });

        expect(slotRes.status).toBe(201);
        const slotId = slotRes.body.id;

        // Customer books slot
        const bookRes = await request(app)
            .post("/api/bookings")
            .set("Authorization", `Bearer ${customerToken}`)
            .send({ slotId: slotId.toString() });

        expect(bookRes.status).toBe(201);
        expect(bookRes.body.slotId).toBe(slotId);

        // Verify slot status is BOOKED
        const updatedSlot = await prisma.slot.findUnique({ where: { id: slotId } });
        expect(updatedSlot?.status).toBe("BOOKED");
    });

    test("2. Booking Conflict (409) - Two customers booking same slot", async () => {
        const startTime = new Date(Date.now() + 8000000).toISOString();
        const endTime = new Date(Date.now() + 9000000).toISOString();

        const slotRes = await request(app)
            .post("/api/slots")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ startTime, endTime });

        const slotId = slotRes.body.id;

        // Simulate concurrent bookings
        const [res1, res2] = await Promise.all([
            request(app).post("/api/bookings").set("Authorization", `Bearer ${customerToken}`).send({ slotId: slotId.toString() }),
            request(app).post("/api/bookings").set("Authorization", `Bearer ${customer2Token}`).send({ slotId: slotId.toString() })
        ]);

        // One should succeed (201), one should fail (409)
        const statuses = [res1.status, res2.status];
        expect(statuses).toContain(201);
        expect(statuses).toContain(409);
    });

    test("3. Authorization - Customer cannot create slots", async () => {
        const res = await request(app)
            .post("/api/slots")
            .set("Authorization", `Bearer ${customerToken}`)
            .send({ startTime: new Date().toISOString(), endTime: new Date().toISOString() });

        expect(res.status).toBe(403);
    });
});
