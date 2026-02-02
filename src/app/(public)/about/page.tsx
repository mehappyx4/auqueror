import { prisma } from "@/lib/prisma"


export const dynamic = "force-dynamic"

export default async function AboutPage() {
    let configMap: Record<string, string> = {};
    try {
        const configs = await prisma.siteConfig.findMany()
        configMap = configs.reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
            acc[curr.key] = curr.value
            return acc
        }, {} as Record<string, string>)
    } catch (error) {
        console.error("Failed to fetch configs, using defaults");
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
            {/* 2. About Me */}
            <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    {configMap.about_image && (
                        <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                            <img src={configMap.about_image} alt="Profile" className="w-full h-full object-cover rounded-full shadow-xl border-4 border-white dark:border-slate-800" />
                        </div>
                    )}
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">About Me</h2>
                        <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-300">
                            <p>
                                {configMap.about_me || "I am passionate about [What you love doing] focusing on solving problems with [Methodology like Data-driven or Human-centered design]. My goal is to deliver [Result provided to clients]."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Core Skills */}
            <section className="py-20 px-6 bg-white dark:bg-slate-950">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900 dark:text-white">Core Skills</h2>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-xl font-semibold mb-6 text-blue-600 dark:text-blue-400">Technical Skills</h3>
                            <div className="flex flex-wrap gap-3">
                                {(configMap.skills_list ? configMap.skills_list.split(',') : ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"]).map((skill) => (
                                    <span key={skill} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-6 text-blue-600 dark:text-blue-400">Soft Skills</h3>
                            <div className="flex flex-wrap gap-3">
                                {["Problem Solving", "Team Leadership", "Fast Learner", "Communication", "Agile Methodology", "Critical Thinking"].map((skill) => (
                                    <span key={skill} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
