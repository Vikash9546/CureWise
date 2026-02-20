import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Attempting to connect to MongoDB...');
        const result = await prisma.user.findFirst();
        console.log('Connection successful! User found:', result ? result.email : 'None');
    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
