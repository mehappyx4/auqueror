
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

(async () => {
    try {
        console.log('Instantiating PrismaClient with log options...');
        const prisma = new PrismaClient({ log: ['info'] });
        console.log('Successfully instantiated PrismaClient');

        console.log('Connecting...');
        await prisma.$connect();
        console.log('Connected');
        await prisma.$disconnect();
    } catch (e) {
        console.error('Caught error during instantiation or connection:');
        console.error(e);
        process.exit(1);
    }
})();
