import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

// GET - List all users
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }
}

// POST - Create new user
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { email, password, name, role } = body

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password required" }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        // Hash password
        const hashedPassword = await hash(password, 12)

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
                role: role || "USER"
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        })

        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        console.error("Error creating user:", error)
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }
}

// PUT - Update user
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { id, email, password, name, role } = body

        if (!id) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 })
        }

        const updateData: any = {}
        if (email) updateData.email = email
        if (name !== undefined) updateData.name = name
        if (role) updateData.role = role
        if (password) {
            updateData.password = await hash(password, 12)
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                updatedAt: true
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("Error updating user:", error)
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }
}

// DELETE - Delete user
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 })
        }

        // Prevent deleting yourself
        if (session.user.id === id) {
            return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
        }

        await prisma.user.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting user:", error)
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
    }
}
