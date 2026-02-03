// Preview Components for Admin Panel

export function HeroPreview({ title, subtitle, description, image }: {
    title: string;
    subtitle: string;
    description: string;
    image?: string;
}) {
    return (
        <div className="mt-8 border-t dark:border-zinc-800 pt-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span>👁️ Live Preview</span>
                <span className="text-xs text-gray-500 font-normal">(Updates in real-time)</span>
            </h3>

            <div className="border-2 border-gray-300 dark:border-zinc-700 rounded-xl overflow-hidden shadow-lg">
                <div
                    className="relative min-h-[400px] flex items-center justify-center p-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500"
                    style={{
                        backgroundImage: `url(${image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 text-center text-white max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                            {title || "Your Hero Title"}
                        </h1>
                        <p className="text-xl md:text-2xl mb-6 text-gray-100">
                            {subtitle || "Your Subtitle"}
                        </p>
                        <p className="text-base md:text-lg text-gray-200 leading-relaxed mb-8">
                            {description || "Your description will appear here. Start typing to see it live!"}
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                View Projects
                            </button>
                            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                                Contact Me
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function AboutPreview({ aboutMe, image, skills, skillsStrategic, timeline = [] }: {
    aboutMe: string;
    image: string;
    skills: string;
    skillsStrategic?: string;
    timeline?: any[];
}) {
    const skillsList = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : []
    const strategicList = skillsStrategic ? skillsStrategic.split(',').map(s => s.trim()).filter(Boolean) : []

    return (
        <div className="mt-8 border-t dark:border-zinc-800 pt-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span>👁️ Live Preview</span>
                <span className="text-xs text-gray-500 font-normal">(Updates in real-time)</span>
            </h3>

            <div className="border-2 border-gray-300 dark:border-zinc-700 rounded-xl overflow-hidden p-8 bg-zinc-950">
                <div className="max-w-4xl mx-auto space-y-16">
                    <div className="grid md:grid-cols-2 gap-12 items-center border-b border-white/5 pb-16">
                        <div>
                            {image ? (
                                <img src={image} alt="Profile" className="w-full rounded-2xl shadow-xl border border-white/10" />
                            ) : (
                                <div className="w-full aspect-square bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center text-white text-6xl shadow-2xl">
                                    👤
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black mb-6 text-white uppercase tracking-tighter">Bio-Data</h2>
                            <p className="text-slate-300 leading-relaxed mb-8">
                                {aboutMe || "Your about me text will appear here..."}
                            </p>

                            <div className="grid grid-cols-1 gap-8">
                                {skillsList.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400">Universal Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {skillsList.map((skill, i) => (
                                                <span key={i} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-slate-300 rounded-lg text-xs font-bold uppercase">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {strategicList.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-pink-400">Strategic Capabilities</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {strategicList.map((skill, i) => (
                                                <span key={i} className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-slate-300 rounded-lg text-xs font-bold uppercase">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Timeline Preview */}
                    <div className="pt-4">
                        <h2 className="text-3xl font-black mb-12 text-center text-white uppercase tracking-tighter">Chronological Orbit</h2>
                        <div className="relative border-l border-white/10 ml-4 max-w-2xl mx-auto">
                            {(timeline.length > 0 ? timeline : [
                                { year: "2018 - 2022", title: "Stellar Academy", description: "Education Milestone", color: "blue" },
                                { year: "Present Day", title: "Current Mission", description: "Active Exploration", color: "purple" }
                            ]).map((item, i) => (
                                <div key={i} className="mb-8 relative pl-8">
                                    <div className="absolute top-1.5 -left-[6px] w-3 h-3 rounded-full" style={{ backgroundColor: item.color === 'pink' ? '#ec4899' : item.color === 'purple' ? '#a855f7' : '#3b82f6' }}></div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/10 mb-2 inline-block" style={{ color: item.color === 'pink' ? '#f472b6' : item.color === 'purple' ? '#c084fc' : '#60a5fa' }}>{item.year}</span>
                                    <h4 className="text-lg font-bold text-white">{item.title}</h4>
                                    <p className="text-slate-400 text-sm font-light mt-1">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ContactPreview({ email, phone, address }: {
    email: string;
    phone: string;
    address: string;
}) {
    return (
        <div className="mt-8 border-t dark:border-zinc-800 pt-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span>👁️ Live Preview</span>
                <span className="text-xs text-gray-500 font-normal">(Updates in real-time)</span>
            </h3>

            <div className="border-2 border-gray-300 dark:border-zinc-700 rounded-xl overflow-hidden p-8 bg-white dark:bg-zinc-900">
                <div className="max-w-2xl mx-auto space-y-6">
                    <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Get In Touch</h2>

                    <div className="space-y-4">
                        {email && (
                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                <div className="text-2xl">📧</div>
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                                    <div className="font-medium dark:text-white">{email}</div>
                                </div>
                            </div>
                        )}

                        {phone && (
                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                <div className="text-2xl">📱</div>
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                                    <div className="font-medium dark:text-white">{phone}</div>
                                </div>
                            </div>
                        )}

                        {address && (
                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                <div className="text-2xl">📍</div>
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Address</div>
                                    <div className="font-medium dark:text-white">{address}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


