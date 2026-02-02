import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

let prisma: PrismaClient

try {
    const hasDB = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL
    if (!hasDB) throw new Error("No Database URL")

    prisma = globalForPrisma.prisma || new PrismaClient()
} catch (e) {
    console.error("Prisma config missing, skipping init:", e)
    prisma = new Proxy({} as PrismaClient, {
        get: (target, prop) => {
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
