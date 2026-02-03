import { prisma } from "@/lib/prisma"
import PortfolioContent from "@/components/PortfolioContent"

export const dynamic = "force-dynamic"

export default async function PortfolioPage() {
    let projects: any[] = [];
    let configMap: Record<string, string> = {};

    try {
        projects = await prisma.project.findMany({
            orderBy: { createdAt: "desc" }
        })

        const configs = await prisma.siteConfig.findMany()
        configs.forEach(item => {
            configMap[item.key] = item.value
        })
    } catch (error) {
        console.error("Failed to fetch projects, using empty list");
    }

    return <PortfolioContent projects={projects} configMap={configMap} />;
}

