import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET() {
    try {
        // 1. Check DB Connection - Be flexible with Vercel's naming
        const dbUrl = process.env.POSTGRES_PRISMA_URL ||
            process.env.DATABASE_URL ||
            Object.keys(process.env).find(key => key.includes('POSTGRES_URL'));

        if (!dbUrl) {
            return NextResponse.json({
                error: "Database Not Connected",
                message: "I couldn't find any Database URL in your environment variables.",
                hint: "Ensure you have clicked 'Connect Project' in Vercel Storage settings.",
                env_keys_found: Object.keys(process.env).filter(k => k.includes('URL') || k.includes('POSTGRES'))
            }, { status: 500 });
        }

        // 2. Hash Password (admin123)
        const hashedPassword = await hash("admin123", 10);

        // 3. Create or Update Admin User (FORCE ADMIN ROLE)
        const admin = await prisma.user.upsert({
            where: { email: "admin@example.com" },
            update: {
                password: hashedPassword,
                role: "ADMIN", // Force update role to ADMIN
                name: "Super Admin"
            },
            create: {
                email: "admin@example.com",
                name: "Super Admin",
                password: hashedPassword,
                role: "ADMIN",
            },
        });

        return NextResponse.json({
            success: true,
            message: "Admin Created/Updated Successfully! 🎉",
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role
            },
            credentials: {
                email: "admin@example.com",
                password: "admin123"
            },
            note: "Admin role has been set/updated to ADMIN"
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to create admin", details: String(error) }, { status: 500 });
    }
}
