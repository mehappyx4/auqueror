"use client"

import { useLanguage } from "@/components/LanguageProvider"

interface AboutContentProps {
    configMap: Record<string, string>
}

export default function AboutContent({ configMap }: AboutContentProps) {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen font-sans text-slate-100">
            {/* About Title */}
            <section className="pt-32 pb-12 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-black mb-4 text-white text-glow">
                        {t("Genesis & Vision", "จุดกำเนิดและวิสัยทัศน์")}
                    </h1>
                    <p className="text-xl text-slate-400 font-light tracking-[0.3em] uppercase">
                        {t("The Story Behind the Star", "เรื่องราวเบื้องหลังดวงดาว")}
                    </p>
                </div>
            </section>

            {/* 2. About Me */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto glass-card rounded-[2.5rem] p-8 md:p-16 cosmic-glow border-white/5">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="w-48 h-48 md:w-72 md:h-72 flex-shrink-0 relative group">
                            <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            {configMap.about_image ? (
                                <img src={configMap.about_image} alt="Profile" className="relative z-10 w-full h-full object-cover rounded-full shadow-2xl border-4 border-white/10" />
                            ) : (
                                <div className="relative z-10 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white text-6xl shadow-2xl border-4 border-white/10">
                                    👤
                                </div>
                            )}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-bold mb-8 text-white uppercase tracking-wider">
                                {t("Bio-Data", "ข้อมูลชีวประวัติ")}
                            </h2>
                            <div className="prose prose-xl prose-invert text-slate-300 font-light leading-relaxed">
                                <p>
                                    {t(
                                        configMap.about_me || "I am passionate about building innovative solutions...",
                                        configMap.about_me_th || configMap.about_me || "ฉันมีความหลงใหลในการสร้างสรรค์นวัตกรรม..."
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chronological Orbit (Biography Timeline) */}
            <section className="py-24 px-6 relative">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-black mb-20 text-center text-white text-glow">
                        {t("Chronological Orbit", "วงโคจรตามกาลเวลา")}
                    </h2>

                    <div className="relative border-l-2 border-white/10 ml-4 md:ml-0 md:left-1/2">
                        {(() => {
                            let timelineData = [];
                            try {
                                timelineData = configMap.about_timeline ? JSON.parse(configMap.about_timeline) : [
                                    { id: "1", year: "2018 - 2022", title: "Stellar Academy", description: "Bachelor of Cosmic Science & Digital Engineering. Graduated with honors in algorithmic navigation.", color: "blue" },
                                    { id: "2", year: "2022 - 2024", title: "Nebula Systems", description: "Lead Interface Architect. Developed zero-gravity UI components for interplanetary data streams.", color: "pink" },
                                    { id: "3", year: "Present Day", title: "Independent Exploration", description: "Deploying custom-built digital ecosystems. Specializing in high-performance Web-Apps and Cyber-Aesthetics.", color: "purple" }
                                ];
                                if (!Array.isArray(timelineData)) timelineData = [];
                            } catch (e) {
                                console.error("Parse error in timeline:", e);
                                timelineData = [];
                            }

                            return timelineData.map((item: any, index: number) => (
                                <div key={item.id} className="mb-16 relative">
                                    <div
                                        className="absolute top-0 -left-[9px] md:left-[-9px] w-4 h-4 rounded-full"
                                        style={{
                                            backgroundColor: item.color === 'blue' ? '#3b82f6' : item.color === 'pink' ? '#ec4899' : '#a855f7',
                                            boxShadow: `0 0 15px ${item.color === 'blue' ? 'rgba(59,130,246,0.8)' : item.color === 'pink' ? 'rgba(236,72,153,0.8)' : 'rgba(168,85,247,0.8)'}`
                                        }}
                                    ></div>
                                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right md:ml-[-50%]' : 'md:pl-12'} ml-8`}>
                                        <span
                                            className="font-bold tracking-widest text-sm uppercase"
                                            style={{ color: item.color === 'blue' ? '#60a5fa' : item.color === 'pink' ? '#f472b6' : '#c084fc' }}
                                        >
                                            {item.year}
                                        </span>
                                        <div className={`glass-card mt-4 p-6 rounded-2xl border-white/5 transition-all group hover:border-${item.color}-500/30`}>
                                            <h3 className="text-xl font-bold text-white transition-colors">
                                                {t(item.title, item.title_th || item.title)}
                                            </h3>
                                            <p className="text-slate-400 mt-2 font-light">
                                                {t(item.description, item.description_th || item.description)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            </section>

            {/* 3. Core Skills */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-black mb-16 text-center text-white text-glow">
                        {t("Universal Tech-Stack", "ทักษะเทคโนโลยีสากล")}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="glass-card rounded-3xl p-10 border-white/5">
                            <h3 className="text-2xl font-bold mb-8 text-blue-400 uppercase tracking-widest flex items-center gap-3">
                                <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
                                {t("Core Technologies", "เทคโนโลยีหลัก")}
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {(configMap.skills_list ? configMap.skills_list.split(',') : ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"]).map((skill) => (
                                    <span key={skill} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200 font-medium hover:bg-blue-500/20 hover:border-blue-500/30 transition-all cursor-default text-lg">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card rounded-3xl p-10 border-white/5">
                            <h3 className="text-2xl font-bold mb-8 text-pink-400 uppercase tracking-widest flex items-center gap-3">
                                <span className="w-8 h-1 bg-pink-500 rounded-full"></span>
                                {t("Strategic Skills", "ทักษะเชิงกลยุทธ์")}
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {(configMap.skills_strategic ? configMap.skills_strategic.split(',') : ["Problem Solving", "Team Leadership", "Fast Learner", "Communication", "Agile Methodology", "Critical Thinking"]).map((skill) => (
                                    <span key={skill} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200 font-medium hover:bg-pink-500/20 hover:border-pink-500/30 transition-all cursor-default text-lg">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
