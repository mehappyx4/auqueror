
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic"

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, title_th, description, description_th, imageUrl, tags, link } = body;

        const project = await prisma.project.create({
            data: {
                title,
                title_th,
                description,
                description_th,
                imageUrl,
                tags,
                link,
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        await prisma.project.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, title, title_th, description, description_th, imageUrl, tags, link } = body;

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        const project = await prisma.project.update({
            where: { id },
            data: {
                title,
                title_th,
                description,
                description_th,
                imageUrl,
                tags,
                link,
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
}
