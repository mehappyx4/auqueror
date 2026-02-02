
import { prisma } from "@/lib/prisma"


export const dynamic = "force-dynamic"

export default async function PortfolioPage() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" }
    })

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
            {/* 4. Work Experience / Portfolio */}
            <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900 dark:text-white">Selected Works</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div key={project.id} className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col">
                                <div className="h-48 bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                                    {project.imageUrl ? (
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                                        {project.link ? (
                                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {project.title}
                                            </a>
                                        ) : (
                                            project.title
                                        )}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-4 flex-1">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 text-sm text-slate-500 mt-auto">
                                        {project.tags.split(',').map((tag, index) => (
                                            <span key={index}>{tag.trim()}</span>
                                        )).reduce((prev, curr, index) => index === 0 ? [curr] : [...prev, <span key={`sep-${index}`}>•</span>, curr], [] as React.ReactNode[])}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {projects.length === 0 && (
                        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                            No projects added yet. Visit the Admin Dashboard to add some!
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
