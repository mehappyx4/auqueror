import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { StarField } from "@/components/StarField";
import FooterContent from "@/components/FooterContent";

export const dynamic = "force-dynamic"

export default async function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Fetch configs with fallback
    let configMap: Record<string, string> = {};
    try {
        const configs = await prisma.siteConfig.findMany();
        configMap = configs.reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);
    } catch (e) {
        console.error("Database connection failed, using defaults");
    }

    return (
        <div className="flex flex-col min-h-screen relative">
            <StarField />
            <Navbar />
            <main className="flex-grow z-10">
                {children}
            </main>
            <FooterContent configMap={configMap} />
        </div>
    );
}
