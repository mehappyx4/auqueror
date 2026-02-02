import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";


export const dynamic = "force-dynamic"

export default async function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Fetch footer content
    const configs = await prisma.siteConfig.findMany();
    const configMap = configs.reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <footer className="py-8 text-center text-sm text-slate-500 dark:text-slate-600 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
                {configMap.footer_text || "© 2026 Personal Website Template. Built with Next.js & Tailwind."}
                <div className="mt-2 text-xs">
                    <a href="/auth/admin-login" className="text-slate-300 dark:text-slate-800 hover:text-slate-500 dark:hover:text-slate-500 transition-colors">
                        Admin Access
                    </a>
                </div>
            </footer>
        </div>
    );
}
