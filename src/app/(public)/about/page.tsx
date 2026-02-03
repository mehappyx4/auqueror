import { prisma } from "@/lib/prisma"
import AboutContent from "@/components/AboutContent"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
    let configMap: Record<string, string> = {};
    try {
        const configs = await prisma.siteConfig.findMany()
        configMap = configs.reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
            acc[curr.key] = curr.value
            return acc
        }, {} as Record<string, string>)
    } catch (error) {
        console.error("Failed to fetch configs, using defaults");
    }

    return <AboutContent configMap={configMap} />;
}

