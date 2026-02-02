import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

let prisma: PrismaClient

try {
    prisma = globalForPrisma.prisma || new PrismaClient()
} catch (e) {
    console.error("Failed to update Prisma Client:", e)
    // Create a dummy proxy that returns empty promises to prevent crash
    prisma = new Proxy({} as PrismaClient, {
        get: (target, prop) => {
            // If asking for a model (e.g. prisma.user), return an object with findMany etc.
            return {
                findMany: async () => [],
                findUnique: async () => null,
                findFirst: async () => null,
                create: async () => ({}),
                update: async () => ({}),
                delete: async () => ({}),
                count: async () => 0,
                upsert: async () => ({}),
            }
        }
    })
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
