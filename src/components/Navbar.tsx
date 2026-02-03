"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useLanguage } from "./LanguageProvider"

export default function Navbar() {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const { language, setLanguage, t } = useLanguage()

    const navLinks = [
        { name: t("Home", "หน้าแรก"), href: "/" },
        { name: t("About", "เกี่ยวกับ"), href: "/about" },
        { name: t("Portfolio", "ผลงาน"), href: "/portfolio" },
        { name: t("Contact", "ติดต่อ"), href: "/contact" },
    ]

    const isActive = (path: string) => pathname === path

    return (
        <nav className="glass-card border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl bg-black/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center group">
                            <span className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all">
                                DARK STAR
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex sm:items-center space-x-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${isActive(link.href)
                                    ? "text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/10"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {session?.user.role === 'ADMIN' && (
                            <Link
                                href="/admin"
                                className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${isActive("/admin")
                                    ? "text-white bg-white/10 border border-white/10"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {t("Admin", "แอดมิน")}
                            </Link>
                        )}

                        {/* Language Toggle */}
                        <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10 ml-4 backdrop-blur-md">
                            <button
                                onClick={() => setLanguage("en")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black transition-all ${language === "en" ? "bg-white text-black shadow-lg shadow-white/20" : "text-slate-500 hover:text-white"}`}
                            >
                                🇺🇸 EN
                            </button>
                            <button
                                onClick={() => setLanguage("th")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black transition-all ${language === "th" ? "bg-white text-black shadow-lg shadow-white/20" : "text-slate-500 hover:text-white"}`}
                            >
                                🇹🇭 TH
                            </button>
                        </div>

                        <div className="flex items-center space-x-4 pl-6 border-l border-white/10">
                            {session ? (
                                <>
                                    <span className="text-xs font-bold text-slate-500 hidden lg:block uppercase tracking-tighter">
                                        {session.user.name || session.user.email}
                                    </span>
                                    <button
                                        onClick={() => signOut()}
                                        className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all"
                                    >
                                        {t("Exit", "ออก")}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-all">
                                        {t("Login", "เข้าสู่ระบบ")}
                                    </Link>
                                    <Link href="/auth/register" className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg">
                                        {t("Join", "เข้าร่วม")}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden gap-4">
                        {/* Mobile Language Toggle */}
                        <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
                            <button
                                onClick={() => setLanguage(language === "en" ? "th" : "en")}
                                className="px-3 py-1 text-[10px] font-black text-white"
                            >
                                {language.toUpperCase()}
                            </button>
                        </div>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-white bg-white/5 border border-white/10 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass-card border-b border-white/5 backdrop-blur-3xl bg-black/80">
                    <div className="pt-4 pb-6 px-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-4 py-3 rounded-xl text-base font-bold uppercase tracking-widest transition-all ${isActive(link.href)
                                    ? "text-white bg-white/10 border border-white/10"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {session?.user.role === 'ADMIN' && (
                            <Link
                                href="/admin"
                                className="block px-4 py-3 rounded-xl text-base font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5"
                                onClick={() => setIsOpen(false)}
                            >
                                {t("Admin HUB", "แอดมินฮับ")}
                            </Link>
                        )}
                        {session ? (
                            <div className="pt-4 mt-4 border-t border-white/10">
                                <div className="px-4 mb-4">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{session.user.name || session.user.email}</span>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="block w-full text-center px-4 py-3 rounded-xl text-base font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                                >
                                    {t("Log out", "ออกจากระบบ")}
                                </button>
                            </div>
                        ) : (
                            <div className="pt-4 mt-4 border-t border-white/10 flex gap-4 px-2">
                                <Link
                                    href="/auth/login"
                                    className="flex-1 text-center py-3 rounded-xl font-bold uppercase text-slate-400 border border-white/10"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {t("Login", "เข้าสู่ระบบ")}
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="flex-1 text-center py-3 rounded-xl font-bold uppercase btn-primary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {t("Join", "เข้าร่วง")}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

