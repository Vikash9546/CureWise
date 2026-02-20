import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SPECIALTIES = [
    "Cardiology", "Neurology", "Dermatology", "Oncology", "Orthopedics",
    "Pediatrics", "Psychiatry", "Gastroenterology", "Ophthalmology", "Endocrinology"
];

const HOSPITALS = [
    "AIIMS, Delhi", "Apollo Hospital, Hyderabad", "Fortis Memorial, Gurugram",
    "Max Super Speciality, Delhi", "Medanta - The Medicity, Gurugram",
    "Christian Medical College, Vellore", "Tata Memorial Hospital, Mumbai",
    "Manipal Hospital, Bengaluru", "Nanavati Max Hospital, Mumbai", "Sir Ganga Ram Hospital, Delhi"
];

const DOCTOR_NAMES = [
    "Dr. Naresh Trehan", "Dr. Devi Shetty", "Dr. Samin Sharma", "Dr. Ashok Seth",
    "Dr. S. Natarajan", "Dr. Arvinder Singh Soin", "Dr. Mohamed Rela", "Dr. Prathap C. Reddy",
    "Dr. Shashank Joshi", "Dr. Raman Rao", "Dr. V.P. Gangadharan", "Dr. H.S. Chhabra",
    "Dr. Milind V. Kirtane", "Dr. Sandeep Vaishya", "Dr. Pradeep Chowbey", "Dr. J.C. Vij",
    "Dr. T.S. Kler", "Dr. Vivek Jawali", "Dr. Sunit Singh Mediratta", "Dr. Rajesh Ahlawat",
    "Dr. J.M. Hans", "Dr. Sanjay Gupta", "Dr. Anjali Verma", "Dr. Priya Sharma",
    "Dr. Vikram Singh", "Dr. Rahul Kapoor", "Dr. Sneha Patil", "Dr. Aditya Menon",
    "Dr. Kavita Reddy", "Dr. Sameer Khan", "Dr. Deepa Nair", "Dr. Manish Malhotra",
    "Dr. Neha Ganjoo", "Dr. Rohan Bhatt", "Dr. Shalini Singh", "Dr. Amit Parekh",
    "Dr. Pooja Saxena", "Dr. Suresh Ram", "Dr. Kiran Mazumdar", "Dr. Gautam Sharma",
    "Dr. Ishani Das", "Dr. Yashvardhan", "Dr. Nandini Gupta", "Dr. Arvind Kumar",
    "Dr. Meera Iyer", "Dr. Sandeep Jha", "Dr. Preeti Jain", "Dr. Anil K. D'Cruz",
    "Dr. Soumya Swaminathan", "Dr. Randeep Guleria"
];

async function main() {
    console.log('Seeding realistic Indian doctors...');

    await prisma.doctor.deleteMany();

    const doctors = [];

    for (let i = 0; i < 50; i++) {
        const name = DOCTOR_NAMES[i];
        const specialty = SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)];
        const hospital = HOSPITALS[Math.floor(Math.random() * HOSPITALS.length)];
        const experience = Math.floor(Math.random() * 25) + 10; // Experienced doctors 10-35 yrs
        const fee = Math.floor(Math.random() * 10) * 100 + 800; // 800-1800
        const rating = (Math.random() * (5 - 4.2) + 4.2).toFixed(1); // Higher ratings for experts

        doctors.push({
            name,
            specialty,
            experience,
            consultancyFee: parseFloat(fee.toString()),
            rating: parseFloat(rating),
            hospitalName: hospital,
            imageUrl: `https://i.pravatar.cc/150?u=${i + 100}`
        });
    }

    await prisma.doctor.createMany({
        data: doctors,
    });

    console.log('Seeded 50 realistic Indian doctors successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
