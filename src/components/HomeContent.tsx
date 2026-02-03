"use client"

import Link from "next/link"
import { useLanguage } from "@/components/LanguageProvider"

interface HomeContentProps {
    configMap: Record<string, string>
}

export default function HomeContent({ configMap }: HomeContentProps) {
    const { language, setLanguage, t } = useLanguage()

    return (
        <main className="min-h-screen font-sans text-slate-100">
            {/* 1. Hero Section */}
            <section
                className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('${configMap.hero_image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"}')`,
                }}
            >

                {/* Hero Background Link */}
                <Link href="/" className="absolute inset-0 z-0" aria-label="Return to Home" />

                {/* Visual Shortcut Toggle (Home Page Only) */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce-slow">
                    <div className="flex items-center bg-black/40 backdrop-blur-md rounded-full p-1.5 border border-white/10 shadow-2xl">
                        <button
                            onClick={() => setLanguage("en")}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black transition-all ${language === "en" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}
                        >
                            🇺🇸 EN
                        </button>
                        <button
                            onClick={() => setLanguage("th")}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black transition-all ${language === "th" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}
                        >
                            🇹🇭 TH
                        </button>
                    </div>
                </div>

                <div className="z-10 max-w-4xl space-y-10 animate-fade-in-up relative px-8 py-20 glass-card rounded-[2.5rem] cosmic-glow border-white/10">
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white text-glow">
                            {t(
                                configMap.hero_title || "[Your Name]",
                                configMap.hero_title_th || configMap.hero_title || "[ชื่อของคุณ]"
                            )}
                        </h1>
                        <p className="text-2xl md:text-3xl font-light text-slate-300 uppercase tracking-[0.2em]">
                            {t(
                                configMap.hero_subtitle || "Creative Designer | Full-stack Developer",
                                configMap.hero_subtitle_th || configMap.hero_subtitle || "นักออกแบบสร้างสรรค์ | นักพัฒนา Full-stack"
                            )}
                        </p>
                    </div>

                    <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
                        {t(
                            configMap.hero_description || "Turning ideas into innovation with years of experience.",
                            configMap.hero_description_th || configMap.hero_description || "เปลี่ยนไอเดียให้เป็นนวัตกรรมด้วยประสบการณ์หลายปี"
                        )}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
                        <Link href="/portfolio" className="btn-primary px-10 py-4 rounded-full font-bold transition-all text-lg">
                            {t("Launch Portfolio", "ดูพอร์ตโฟลิโอ")}
                        </Link>
                        <Link href="/contact" className="btn-secondary px-10 py-4 rounded-full font-bold transition-all text-lg">
                            {t("Initialize Contact", "ติดต่อฉัน")}
                        </Link>
                    </div>
                </div>
            </section>
        </main >
    )
}
