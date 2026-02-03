import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('🌌 Applying "Dark Star" Theme...')

    const themeConfigs = [
        { key: 'theme_primary_color', value: '#8b5cf6' }, // Electric Purple
        { key: 'theme_secondary_color', value: '#ec4899' }, // Magenta Glow
        { key: 'theme_font_family', value: 'Outfit' },
        { key: 'theme_background_image', value: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2560&auto=format&fit=crop' }, // Real Nebula
        { key: 'hero_title', value: 'Dark Star Portfolio' },
        { key: 'hero_subtitle', value: 'Navigating the Digital Galaxy' }
    ]

    for (const config of themeConfigs) {
        await prisma.siteConfig.upsert({
            where: { key: config.key },
            update: { value: config.value },
            create: { key: config.key, value: config.value },
        })
    }

    console.log('✅ Dark Star Theme Applied to Database!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
