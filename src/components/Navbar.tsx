"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { usePathname } from "next/navigation"

export default function Navbar() {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Portfolio", href: "/portfolio" },
        { name: "Contact", href: "/contact" },
    ]

    const isActive = (path: string) => pathname === path

    return (
        <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                                MyWeb
                            </span>
                        </Link>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.href)
                                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {session?.user.role === 'ADMIN' && (
                            <Link
                                href="/admin"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/admin")
                                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                            >
                                Admin
                            </Link>
                        )}

                        {session ? (
                            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                                <span className="text-sm text-gray-500 hidden lg:block">{session.user.name || session.user.email}</span>
                                <button
                                    onClick={() => signOut()}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 pl-4 border-l border-gray-200 dark:border-gray-700">
                                <Link href="/auth/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                    Login
                                </Link>
                                <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Icon */}
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="sm:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.href)
                                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {session?.user.role === 'ADMIN' && (
                            <Link
                                href="/admin"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50"
                                onClick={() => setIsOpen(false)}
                            >
                                Admin
                            </Link>
                        )}
                        {session ? (
                            <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-800">
                                <div className="px-3 mb-2">
                                    <span className="text-sm text-gray-500">{session.user.name || session.user.email}</span>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-900 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-800 flex gap-2 px-3">
                                <Link
                                    href="/auth/login"
                                    className="flex-1 text-center block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 dark:border-gray-700"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="flex-1 text-center block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
