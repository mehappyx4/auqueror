import { prisma } from "@/lib/prisma"
import ContactContent from "@/components/ContactContent"

export const dynamic = "force-dynamic"

export default async function ContactPage() {
    let configMap: Record<string, string> = {};
    try {
        const configs = await prisma.siteConfig.findMany();
        configMap = configs.reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);
    } catch (error) {
        console.error("Failed to fetch configs:", error);
    }

    return <ContactContent configMap={configMap} />;
}

