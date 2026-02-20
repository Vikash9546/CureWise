import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding 20 Natural Medicine Doctors with City data...");

    const naturalDoctors = [
        {
            name: "Dr. Rajesh Iyer",
            specialty: "Ayurveda",
            experience: 18,
            consultancyFee: 900,
            rating: 4.9,
            imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
            hospitalName: "AyurVeda Wellness Hub",
            city: "Bangalore",
            lat: 12.9716, lon: 77.5946
        },
        {
            name: "Dr. Meera Nair",
            specialty: "Ayurveda",
            experience: 14,
            consultancyFee: 750,
            rating: 4.8,
            imageUrl: "https://images.unsplash.com/photo-1594824813573-2313433ed6a4?w=400",
            hospitalName: "Kairali Healing Center",
            city: "Kochi",
            lat: 10.8505, lon: 76.2711
        },
        {
            name: "Dr. Amit Pathak",
            specialty: "Naturopathy",
            experience: 10,
            consultancyFee: 1100,
            rating: 4.7,
            imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
            hospitalName: "Nature Cure Ashram",
            city: "Delhi",
            lat: 28.6139, lon: 77.2090
        },
        {
            name: "Dr. Sunita Reddy",
            specialty: "Homeopathy",
            experience: 9,
            consultancyFee: 500,
            rating: 4.6,
            imageUrl: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=400",
            hospitalName: "Vital Essence Clinic",
            city: "Hyderabad",
            lat: 17.3850, lon: 78.4867
        },
        {
            name: "Dr. Arvind Swami",
            specialty: "Siddha Medicine",
            experience: 25,
            consultancyFee: 1500,
            rating: 4.9,
            imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400",
            hospitalName: "Ancient Tamil Healing",
            city: "Chennai",
            lat: 13.0827, lon: 80.2707
        },
        {
            name: "Dr. Fatima Sheikh",
            specialty: "Unani Medicine",
            experience: 16,
            consultancyFee: 850,
            rating: 4.8,
            imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
            hospitalName: "Al-Shifa Unani Health",
            city: "Noida",
            lat: 28.5355, lon: 77.3910
        },
        {
            name: "Dr. Karan Malhotra",
            specialty: "Yoga Therapy",
            experience: 12,
            consultancyFee: 1000,
            rating: 4.9,
            imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
            hospitalName: "Zen Yoga Wellness",
            city: "Rishikesh",
            lat: 30.0869, lon: 78.2676
        },
        {
            name: "Dr. Ishita Das",
            specialty: "Ayurveda",
            experience: 7,
            consultancyFee: 600,
            rating: 4.5,
            imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400",
            hospitalName: "Panchakarma Retreat",
            city: "Kolkata",
            lat: 22.5726, lon: 88.3639
        },
        {
            name: "Dr. Suresh Gopinath",
            specialty: "Naturopathy",
            experience: 20,
            consultancyFee: 1300,
            rating: 4.9,
            imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
            hospitalName: "Earthly Healing Ashram",
            city: "Mysore",
            lat: 12.2958, lon: 76.6394
        },
        {
            name: "Dr. Kavita Joshi",
            specialty: "Herbal Medicine",
            experience: 15,
            consultancyFee: 950,
            rating: 4.7,
            imageUrl: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=400",
            hospitalName: "Himalayan Herbs Clinic",
            city: "Dehradun",
            lat: 30.3165, lon: 78.0322
        },
        {
            name: "Dr. Rohan Varma",
            specialty: "Ayurveda",
            experience: 22,
            consultancyFee: 1800,
            rating: 4.9,
            imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400",
            hospitalName: "Royal Ayur Care",
            city: "Pune",
            lat: 18.5204, lon: 73.8567
        },
        {
            name: "Dr. Priya Bansal",
            specialty: "Homeopathy",
            experience: 11,
            consultancyFee: 700,
            rating: 4.6,
            imageUrl: "https://images.unsplash.com/photo-1594824813573-2313433ed6a4?w=400",
            hospitalName: "Gentle Cure Center",
            city: "Jaipur",
            lat: 26.9124, lon: 75.7873
        },
        {
            name: "Dr. Naveen Kumar",
            specialty: "Yoga Therapy",
            experience: 13,
            consultancyFee: 800,
            rating: 4.8,
            imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
            hospitalName: "Mind-Body Balance",
            city: "Goa",
            lat: 15.2993, lon: 74.1240
        },
        {
            name: "Dr. Sneha Patil",
            specialty: "Naturopathy",
            experience: 8,
            consultancyFee: 900,
            rating: 4.5,
            imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
            hospitalName: "Green Life Wellness",
            city: "Nagpur",
            lat: 21.1458, lon: 79.0882
        },
        {
            name: "Dr. Zahid Ahmed",
            specialty: "Unani Medicine",
            experience: 30,
            consultancyFee: 2000,
            rating: 5.0,
            imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
            hospitalName: "Classic Unani Hospital",
            city: "Lucknow",
            lat: 26.8467, lon: 80.9462
        },
        {
            name: "Dr. Anjali Menon",
            specialty: "Ayurveda",
            experience: 19,
            consultancyFee: 1200,
            rating: 4.9,
            imageUrl: "https://images.unsplash.com/photo-1594824813573-2313433ed6a4?w=400",
            hospitalName: "Dhanwantari Ayur",
            city: "Kozhikode",
            lat: 11.2588, lon: 75.7804
        },
        {
            name: "Dr. Sanjay Gupta",
            specialty: "Homeopathy",
            experience: 24,
            consultancyFee: 1100,
            rating: 4.8,
            imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400",
            hospitalName: "Global Homeo Care",
            city: "Ahmedabad",
            lat: 23.0225, lon: 72.5714
        },
        {
            name: "Dr. Lakshmi Prasad",
            specialty: "Siddha Medicine",
            experience: 21,
            consultancyFee: 1400,
            rating: 4.9,
            imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
            hospitalName: "Agastya Siddha Hub",
            city: "Coimbatore",
            lat: 11.0168, lon: 76.9558
        },
        {
            name: "Dr. Rahul Shrivastav",
            specialty: "Ayurveda",
            experience: 15,
            consultancyFee: 900,
            rating: 4.7,
            imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
            hospitalName: "Vedic Health Society",
            city: "Bhopal",
            lat: 23.2599, lon: 77.4126
        },
        {
            name: "Dr. Monica Singh",
            specialty: "Naturopathy",
            experience: 10,
            consultancyFee: 800,
            rating: 4.6,
            imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400",
            hospitalName: "Pure Nature Clinic",
            city: "Chandigarh",
            lat: 30.7333, lon: 76.7794
        }
    ];

    for (const doc of naturalDoctors) {
        await prisma.doctor.upsert({
            where: { id: "000000000000000000000000" },
            update: doc,
            create: doc
        }).catch(async () => {
            const existing = await prisma.doctor.findFirst({ where: { name: doc.name } });
            if (!existing) {
                await prisma.doctor.create({ data: doc });
            } else {
                await prisma.doctor.update({ where: { id: existing.id }, data: doc });
            }
        });
    }

    console.log("Successfully seeded 20 Natural Medicine experts with City info.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
