import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET() {
    try {
        // Hash password
        const hashedPassword = await hash("admin123", 10);

        // Create new admin user
        const admin = await prisma.user.upsert({
            where: { email: "admin2@example.com" },
            update: {
                password: hashedPassword,
                role: "ADMIN",
                name: "Admin 2"
            },
            create: {
                email: "admin2@example.com",
                name: "Admin 2",
                password: hashedPassword,
                role: "ADMIN",
            },
        });

        return NextResponse.json({
            success: true,
            message: "Admin2 Created Successfully! 🎉",
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role
            },
            credentials: {
                email: "admin2@example.com",
                password: "admin123"
            },
            loginUrl: "https://auqueror-78wq.vercel.app/auth/admin-login"
        });

    } catch (error) {
        return NextResponse.json({
            error: "Failed to create admin2",
            details: String(error)
        }, { status: 500 });
    }
}
