import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        // Fetch theme settings from database
        const configs = await prisma.siteConfig.findMany({
            where: {
                key: {
                    in: ['theme_primary_color', 'theme_secondary_color', 'theme_font_family', 'theme_background_image']
                }
            }
        })

        // Convert to object
        const theme = {
            primaryColor: configs.find(c => c.key === 'theme_primary_color')?.value || '#3b82f6',
            secondaryColor: configs.find(c => c.key === 'theme_secondary_color')?.value || '#8b5cf6',
            fontFamily: configs.find(c => c.key === 'theme_font_family')?.value || 'Inter',
            backgroundImage: configs.find(c => c.key === 'theme_background_image')?.value || ''
        }

        return NextResponse.json(theme)
    } catch (error) {
        console.error('Theme API error:', error)
        return NextResponse.json(
            {
                primaryColor: '#3b82f6',
                secondaryColor: '#8b5cf6',
                fontFamily: 'Inter'
            },
            { status: 200 }
        )
    }
}
