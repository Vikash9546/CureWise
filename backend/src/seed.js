import store from "./models/index.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const prisma = store; // Keep alias for easier migration within the file

async function main() {
    await connectDB();
    const password = await bcrypt.hash("password123", 10);

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {
            password,
            role: "ADMIN",
        },
        create: {
            email: "admin@example.com",
            password,
            role: "ADMIN",
            badges: ["beginner"],
            challengesJoined: [],
            challengesCompleted: [],
            challengeProgress: {},
            likedPostIds: [],
            savedPostIds: [],
            registeredEvents: []
        }
    });

    // Create Customer
    await prisma.user.upsert({
        where: { email: "customer@example.com" },
        update: {
            password,
            role: "CUSTOMER",
        },
        create: {
            email: "customer@example.com",
            password,
            role: "CUSTOMER",
            badges: ["beginner"],
            challengesJoined: [],
            challengesCompleted: [],
            challengeProgress: {},
            likedPostIds: [],
            savedPostIds: [],
            registeredEvents: []
        }
    });

    console.log("Seed data created: Admin (admin@example.com), Customer (customer@example.com)");
    console.log("Password for both: password123");

    // Seed Doctors
    const doctors = [
        {
            name: "Dr. Ananya Sharma",
            specialty: "Ayurveda",
            experience: 12,
            consultancyFee: 800,
            rating: 4.8,
            imageUrl: "https://images.unsplash.com/photo-1594824813573-2313433ed6a4?w=400",
            hospitalName: "AyurCare Holistic Center",
            city: "Mumbai",
            lat: 19.0760, lon: 72.8777
        },
        {
            name: "Dr. Vikram Mehta",
            specialty: "Naturopathy",
            experience: 15,
            consultancyFee: 1200,
            rating: 4.9,
            imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
            hospitalName: "Nature Cure Wellness",
            city: "Mumbai",
            lat: 19.1200, lon: 72.9100
        },
        {
            name: "Dr. Sarah D'souza",
            specialty: "Homeopathy",
            experience: 8,
            consultancyFee: 600,
            rating: 4.7,
            imageUrl: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=400",
            hospitalName: "Healing Touch Clinic",
            city: "Mumbai",
            lat: 19.0500, lon: 72.8500
        },
        {
            name: "Dr. Robert Wilson",
            specialty: "Cardiology",
            experience: 20,
            consultancyFee: 2500,
            rating: 4.9,
            imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400",
            hospitalName: "Metro Heart Institute",
            city: "Delhi",
            lat: 28.6139, lon: 77.2090
        }
    ];

    for (const doc of doctors) {
        const existingDoc = await prisma.doctorProfile.findFirst({
            where: { name: doc.name }
        });
        const docData = {
            name: doc.name,
            specialty: doc.specialty,
            experience: doc.experience,
            consultancyFee: doc.consultancyFee,
            rating: doc.rating,
            imageUrl: doc.imageUrl,
            hospitalName: doc.hospitalName,
            city: doc.city,
            location: { lat: doc.lat, lon: doc.lon }
        };

        if (existingDoc) {
            await prisma.doctorProfile.update({
                where: { id: existingDoc.id },
                data: docData
            });
        } else {
            await prisma.doctorProfile.create({
                data: docData
            });
        }
    }
    console.log("Main doctors with city data seeded.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
