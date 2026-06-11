import prisma from "../models/index.js";

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("MySQL Database Connected via Prisma");
    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
