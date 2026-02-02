"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: "📊" },
        { name: "Back to Site", href: "/", icon: "🏠" },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-zinc-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 flex flex-col h-screen sticky top-0">
                <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                        Admin Panel
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === item.href
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900"
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
                    <div className="mb-4 px-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {session?.user?.name || "Admin"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {session?.user?.email}
                        </p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <span className="text-lg">🚪</span>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
