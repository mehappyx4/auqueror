import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

let prisma: PrismaClient

try {
    // Be flexible with Vercel's naming conventions
    const dbUrl = process.env.POSTGRES_PRISMA_URL ||
        process.env.DATABASE_URL ||
        Object.keys(process.env).find(key => key.includes('POSTGRES_PRISMA_URL') || key.includes('POSTGRES_URL'));

    if (!dbUrl) throw new Error("No Database URL found in environment variables");

    prisma = globalForPrisma.prisma || new PrismaClient()
} catch (e) {
    console.warn("Prisma Init Skipped (Using Fallback):", e)
    prisma = new Proxy({} as PrismaClient, {
        get: (target, prop) => {
            if (prop === '$connect' || prop === '$disconnect') return async () => { }
            if (prop === 'then') return undefined

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
