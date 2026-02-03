import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET() {
    try {
        // Hash new password
        const newPassword = "admin123"; // เปลี่ยนได้ตามต้องการ
        const hashedPassword = await hash(newPassword, 10);

        // Update admin password
        const admin = await prisma.user.update({
            where: { email: "admin@example.com" },
            data: {
                password: hashedPassword,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Admin password has been reset successfully! 🔑",
            credentials: {
                email: "admin@example.com",
                password: newPassword,
            },
            note: "Please login with these credentials and change your password immediately."
        });

    } catch (error) {
        return NextResponse.json({
            error: "Failed to reset admin password",
            details: String(error),
            hint: "Make sure admin@example.com exists in the database. Run /api/seed-admin first if needed."
        }, { status: 500 });
    }
}
