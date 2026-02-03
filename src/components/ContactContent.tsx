"use client"

import { useLanguage } from "@/components/LanguageProvider"

interface ContactContentProps {
    configMap: Record<string, string>
}

export default function ContactContent({ configMap }: ContactContentProps) {
    const { t } = useLanguage()

    return (
        <div
            className="min-h-screen font-sans text-slate-100 relative"
            style={configMap.contact_background ? {
                backgroundImage: `url(${configMap.contact_background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            } : {}}
        >
            {configMap.contact_background && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            )}
            <section className="pt-32 pb-12 px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-black mb-4 text-white text-glow">
                        {t(configMap.contact_title || "Signal Transmissions", configMap.contact_title_th || configMap.contact_title || "ส่งสัญญาณการติดต่อ")}
                    </h1>
                    <p className="text-xl text-slate-400 font-light tracking-[0.3em] uppercase">
                        {t(configMap.contact_subtitle || "Establish Connection", configMap.contact_subtitle_th || configMap.contact_subtitle || "สร้างการเชื่อมต่อ")}
                    </p>
                </div>
            </section>

            <section className="py-20 px-6 relative z-10">
                <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-12 md:p-24 cosmic-glow border-white/5">
                    <p className="text-xl md:text-2xl text-slate-400 mb-20 text-center font-light leading-relaxed max-w-3xl mx-auto">
                        {t(
                            configMap.contact_description || "Interested in synchronized innovation? Feel free to initiate a signal for collaborations across the digital galaxy.",
                            configMap.contact_description_th || configMap.contact_description || "สนใจในนวัตกรรมที่สอดประสานกันหรือไม่? รู้สึกอิสระที่จะเริ่มส่งสัญญาณเพื่อความร่วมมือในกาแล็กซีดิจิทัล"
                        )}
                    </p>

                    <div className="grid md:grid-cols-3 gap-16 relative">
                        {/* Connecting line for desktop */}
                        <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        <div className="flex flex-col items-center gap-6 group relative z-10">
                            <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all duration-500 group-hover:scale-110 shadow-lg">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <div className="text-center">
                                <span className="block font-bold text-white uppercase tracking-widest text-xs mb-2">
                                    {t("Comms Channel", "ช่องทางการสื่อสาร")}
                                </span>
                                <a href={`mailto:${configMap.contact_email || "your.email@example.com"}`} className="text-lg text-slate-400 hover:text-white transition-colors">
                                    {configMap.contact_email || "your.email@example.com"}
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-6 group relative z-10">
                            <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-pink-500/20 group-hover:border-pink-500/30 transition-all duration-500 group-hover:scale-110 shadow-lg">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
                            </div>
                            <div className="text-center">
                                <span className="block font-bold text-white uppercase tracking-widest text-xs mb-2">
                                    {t("Network Node", "โหนดเครือข่าย")}
                                </span>
                                <a href={configMap.social_linkedin || "#"} target="_blank" className="text-lg text-slate-400 hover:text-white transition-colors">
                                    {configMap.social_linkedin ? t("LinkedIn Profile", "โปรไฟล์ LinkedIn") : t("Connect via Node", "เชื่อมต่อผ่านโหนด")}
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-6 group relative z-10">
                            <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-all duration-500 group-hover:scale-110 shadow-lg">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div className="text-center">
                                <span className="block font-bold text-white uppercase tracking-widest text-xs mb-2">
                                    {t("Origin Point", "จุดกำเนิด")}
                                </span>
                                <span className="text-lg text-slate-400">
                                    {t(configMap.contact_address || "Earth, Solar System", configMap.contact_address_th || configMap.contact_address || "โลก, ระบบสุริยะ")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
