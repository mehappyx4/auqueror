import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
    const session = await getServerSession(authOptions)

    // Allow public public read? Or just admin?
    // Usually public needs to read content, but this API might be for admin panel list.
    // Let's protect this specific management endpoint, but public page will query DB directly or use a public API.

    if (session?.user.role !== "ADMIN") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const configs = await prisma.siteConfig.findMany()
    return NextResponse.json(configs)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (session?.user.role !== "ADMIN") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { key, value } = body

        if (!key || value === undefined) {
            return NextResponse.json({ message: "Missing key or value" }, { status: 400 })
        }

        const config = await prisma.siteConfig.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        })

        return NextResponse.json(config)
    } catch (error) {
        return NextResponse.json({ message: "Error updating config" }, { status: 500 })
    }
}
