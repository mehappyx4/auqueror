"use client"

import { useLanguage } from "@/components/LanguageProvider"

interface Project {
    id: string
    title: string
    title_th?: string | null
    description: string
    description_th?: string | null
    imageUrl: string
    tags: string
    link?: string | null
}

interface PortfolioContentProps {
    projects: Project[]
}

export default function PortfolioContent({ projects }: PortfolioContentProps) {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen font-sans text-slate-100">
            {/* Portfolio Title */}
            <section className="pt-32 pb-12 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-black mb-4 text-white text-glow">
                        {t("Project Archive", "คลังเก็บโปรเจกต์")}
                    </h1>
                    <p className="text-xl text-slate-400 font-light tracking-[0.3em] uppercase">
                        {t("Digital Discoveries", "การค้นพบทางดิจิทัล")}
                    </p>
                </div>
            </section>

            {/* 4. Work Experience / Portfolio */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {projects.map((project) => (
                            <div key={project.id} className="group glass-card rounded-[2rem] overflow-hidden cosmic-glow border-white/5 flex flex-col transition-all duration-500 hover:translate-y-[-10px] hover:border-white/20">
                                <div className="h-64 bg-slate-900 overflow-hidden relative">
                                    {project.imageUrl ? (
                                        <img
                                            src={project.imageUrl}
                                            alt={t(project.title, project.title_th || project.title)}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-950 font-black tracking-tighter text-4xl uppercase opacity-20">
                                            {t("No Visual", "ไม่มีภาพ")}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col relative">
                                    <h3 className="text-2xl font-black mb-4 text-white group-hover:text-glow transition-all">
                                        {project.link ? (
                                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {t(project.title, project.title_th || project.title)}
                                            </a>
                                        ) : (
                                            t(project.title, project.title_th || project.title)
                                        )}
                                    </h3>
                                    <p className="text-slate-400 mb-8 flex-1 font-light leading-relaxed">
                                        {t(project.description, project.description_th || project.description)}
                                    </p>
                                    <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                                        {project.tags.split(',').map((tag: string, index: number) => (
                                            <span key={index} className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-500 border border-white/5 uppercase tracking-widest">{tag.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {projects.length === 0 && (
                        <div className="text-center py-32 glass-card rounded-[3rem] border-white/5">
                            <h3 className="text-3xl font-bold text-slate-600">
                                {t("The sector is currently empty.", "ส่วนนี้ว่างเปล่าในขณะนี้")}
                            </h3>
                            <p className="text-slate-700 mt-4">
                                {t("Visit the Hub to authorize new data entries.", "ไปที่แผงควบคุมเพื่อเพิ่มข้อมูลใหม่")}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
