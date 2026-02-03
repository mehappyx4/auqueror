import { prisma } from "@/lib/prisma"
import PortfolioContent from "@/components/PortfolioContent"

export const dynamic = "force-dynamic"

export default async function PortfolioPage() {
    let projects: any[] = [];
    try {
        projects = await prisma.project.findMany({
            orderBy: { createdAt: "desc" }
        })
    } catch (error) {
        console.error("Failed to fetch projects, using empty list");
    }

    return <PortfolioContent projects={projects} />;
}

