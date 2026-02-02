import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

let prisma: PrismaClient

try {
    const hasDB = process.env.POSTGRES_PRISMA_URL
    if (!hasDB) throw new Error("No POSTGRES_PRISMA_URL found")

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
