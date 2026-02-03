import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const seoConfigs = await prisma.siteConfig.findMany({
            where: {
                key: {
                    contains: 'seo',
                    mode: 'insensitive' // Postgres case insensitive
                }
            }
        })

        console.log('Found SEO keys:', seoConfigs)
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
