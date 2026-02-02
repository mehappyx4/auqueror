
import { prisma } from '../lib/prisma';

async function main() {
    try {
        console.log('Connecting to database...');
        // In v6, explicit connect isn't strictly necessary for queries, but good for verification
        await prisma.$connect();
        console.log('Successfully connected to database!');

        // Simple query to verify
        const count = await prisma.user.count();
        console.log(`User count: ${count}`);

        process.exit(0);
    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
