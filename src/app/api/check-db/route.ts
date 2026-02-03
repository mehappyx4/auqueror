import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Get all users from database
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        // Find admin user specifically
        const adminUser = users.find(u => u.email === "admin@example.com");

        return NextResponse.json({
            success: true,
            totalUsers: users.length,
            users: users,
            adminUser: adminUser || null,
            adminExists: !!adminUser,
            adminRole: adminUser?.role || "NOT_FOUND",
            note: adminUser
                ? `Admin exists with role: ${adminUser.role}`
                : "Admin user not found in database"
        });

    } catch (error) {
        return NextResponse.json({
            error: "Failed to check database",
            details: String(error)
        }, { status: 500 });
    }
}
