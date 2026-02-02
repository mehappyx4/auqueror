"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type ConfigItem = {
    key: string
    value: string
}

type Project = {
    id: string
    title: string
    description: string
    imageUrl: string
    tags: string
    link?: string
}

type Tab = "HOME" | "ABOUT" | "PORTFOLIO" | "CONTACT" | "GLOBAL"

export default function AdminDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [activeTab, setActiveTab] = useState<Tab>("HOME")

    // Config State
    const [configs, setConfigs] = useState<Record<string, string>>({
        hero_title: "",
        hero_subtitle: "",
        hero_description: "",
        hero_image: "",
        about_me: "",
        about_image: "",
        skills_list: "",
        footer_text: ""
    })

    // Projects State
    const [projects, setProjects] = useState<Project[]>([])
    const [isEditing, setIsEditing] = useState<string | null>(null)
    const [projectForm, setProjectForm] = useState<Omit<Project, 'id'>>({
        title: "",
        description: "",
        imageUrl: "",
        tags: "",
        link: ""
    })

    // Loading States
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login")
        } else if (status === "authenticated") {
            if (session.user.role !== "ADMIN") {
                router.push("/")
            } else {
                fetchConfigs()
                fetchProjects()
            }
        }
    }, [status, session, router])

    const fetchConfigs = async () => {
        try {
            const res = await fetch("/api/admin/config")
            if (res.ok) {
                const data: ConfigItem[] = await res.json()
                const configMap: Record<string, string> = {}
                data.forEach(item => {
                    configMap[item.key] = item.value
                })
                setConfigs(prev => ({ ...prev, ...configMap }))
            }
        } catch (error) {
            console.error("Failed to fetch configs", error)
        }
    }

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/projects")
            if (res.ok) {
                const data = await res.json()
                setProjects(data)
            }
        } catch (error) {
            console.error("Failed to fetch projects", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveConfig = async (key: string) => {
        setSaving(true)
        setMessage("")
        try {
            const res = await fetch("/api/admin/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key, value: configs[key] }),
            })

            if (res.ok) {
                setMessage(`Saved ${key}`)
                setTimeout(() => setMessage(""), 3000)
            } else {
                setMessage("Error saving")
            }
        } catch (error) {
            setMessage("Error saving")
        } finally {
            setSaving(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "project" | "config", configKey?: string) => {
        if (!e.target.files?.[0]) return
        setUploading(true)
        const formData = new FormData()
        formData.append("file", e.target.files[0])

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            })
            const data = await res.json()
            if (data.url) {
                if (target === "project") {
                    setProjectForm(prev => ({ ...prev, imageUrl: data.url }))
                } else if (target === "config" && configKey) {
                    setConfigs(prev => ({ ...prev, [configKey]: data.url }))
                    // Auto-save config image
                    await fetch("/api/admin/config", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ key: configKey, value: data.url }),
                    })
                    setMessage(`${configKey} Updated`)
                }
            }
        } catch (error) {
            console.error("Upload failed", error)
        } finally {
            setUploading(false)
        }
    }

    const handleSaveProject = async () => {
        if (!projectForm.title || !projectForm.description) return
        setSaving(true)
        try {
            const method = isEditing ? "PUT" : "POST"
            const body = isEditing ? { ...projectForm, id: isEditing } : projectForm

            const res = await fetch("/api/projects", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            if (res.ok) {
                setMessage(isEditing ? "Project Updated" : "Project Created")
                fetchProjects()
                setProjectForm({ title: "", description: "", imageUrl: "", tags: "", link: "" })
                setIsEditing(null)
                setTimeout(() => setMessage(""), 3000)
            }
        } catch (error) {
            console.error("Failed to save project", error)
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteProject = async (id: string) => {
        if (!confirm("Are you sure?")) return
        try {
            await fetch(`/api/projects?id=${id}`, { method: "DELETE" })
            fetchProjects()
        } catch (error) {
            console.error("Failed to delete", error)
        }
    }

    const handleEditProject = (project: Project) => {
        setIsEditing(project.id)
        setProjectForm({
            title: project.title,
            description: project.description,
            imageUrl: project.imageUrl,
            tags: project.tags,
            link: project.link || ""
        })
    }

    if (status === "loading" || loading) {
        return <div className="p-8 text-center">Loading...</div>
    }

    if (!session || session.user.role !== "ADMIN") {
        return null
    }

    const tabs: { id: Tab, label: string }[] = [
        { id: "HOME", label: "Home" },
        { id: "ABOUT", label: "About" },
        { id: "PORTFOLIO", label: "Portfolio" },
        { id: "CONTACT", label: "Contact" },
        { id: "GLOBAL", label: "Global Settings" },
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                {message && (
                    <div className="animate-fade-in bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded-md font-medium">
                        {message}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white dark:bg-zinc-900 p-1 rounded-xl shadow-sm mb-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 min-w-[100px]
                            ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                            }
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-6 border border-gray-100 dark:border-zinc-800">

                {/* 1. HOME TAB */}
                {activeTab === "HOME" && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex justify-between items-center pb-4 border-b dark:border-zinc-800">
                            <h2 className="text-xl font-bold">Home Page Configuration</h2>
                            <a href="/" target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                Preview Page ↗
                            </a>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Hero Title</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                            value={configs.hero_title}
                                            onChange={e => setConfigs({ ...configs, hero_title: e.target.value })}
                                        />
                                        <button onClick={() => handleSaveConfig("hero_title")} className="bg-slate-900 dark:bg-slate-700 text-white px-4 rounded-lg hover:opacity-90">Save</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                            value={configs.hero_subtitle || ""}
                                            onChange={e => setConfigs({ ...configs, hero_subtitle: e.target.value })}
                                        />
                                        <button onClick={() => handleSaveConfig("hero_subtitle")} className="bg-slate-900 dark:bg-slate-700 text-white px-4 rounded-lg hover:opacity-90">Save</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Hero Description</label>
                                    <div className="flex gap-2">
                                        <textarea
                                            className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                            rows={3}
                                            value={configs.hero_description || ""}
                                            onChange={e => setConfigs({ ...configs, hero_description: e.target.value })}
                                        />
                                        <div className="flex flex-col justify-end">
                                            <button onClick={() => handleSaveConfig("hero_description")} className="h-10 bg-slate-900 dark:bg-slate-700 text-white px-4 rounded-lg hover:opacity-90">Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium mb-1">Hero Background Image</label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <input
                                        type="file"
                                        id="hero-upload"
                                        className="hidden"
                                        onChange={(e) => handleImageUpload(e, "config", "hero_image")}
                                    />
                                    <label htmlFor="hero-upload" className="cursor-pointer block">
                                        {configs.hero_image ? (
                                            <div className="relative h-48 w-full rounded-lg overflow-hidden shadow-sm">
                                                <img src={configs.hero_image} alt="Hero" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <span className="text-white font-medium">Click to Change</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-8 text-gray-400">
                                                <div className="text-4xl mb-2">🖼️</div>
                                                <span className="text-sm">Click to upload background image</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. ABOUT TAB */}
                {activeTab === "ABOUT" && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex justify-between items-center pb-4 border-b dark:border-zinc-800">
                            <h2 className="text-xl font-bold">About Page Configuration</h2>
                            <a href="/about" target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                Preview Page ↗
                            </a>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-medium mb-1">Profile Configuration</label>
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <textarea
                                            className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                            rows={6}
                                            placeholder="Write something about yourself..."
                                            value={configs.about_me || ""}
                                            onChange={e => setConfigs({ ...configs, about_me: e.target.value })}
                                        />
                                        <div className="flex flex-col justify-end">
                                            <button onClick={() => handleSaveConfig("about_me")} className="h-10 bg-slate-900 dark:bg-slate-700 text-white px-4 rounded-lg hover:opacity-90">Save</button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Profile Picture</label>
                                        <div className="border border-gray-200 dark:border-zinc-700 rounded-xl p-4 flex items-center gap-6">
                                            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                                                {configs.about_image ? (
                                                    <img src={configs.about_image} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                    onChange={(e) => handleImageUpload(e, "config", "about_image")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Skills List</label>
                                <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-slate-100 dark:border-zinc-800">
                                    <p className="text-xs text-gray-500 mb-2">Separate each skill with a comma (e.g. React, Node.js, Design)</p>
                                    <div className="flex gap-2">
                                        <textarea
                                            className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
                                            rows={8}
                                            value={configs.skills_list || ""}
                                            onChange={e => setConfigs({ ...configs, skills_list: e.target.value })}
                                        />
                                    </div>
                                    <div className="mt-2 text-right">
                                        <button onClick={() => handleSaveConfig("skills_list")} className="bg-slate-900 dark:bg-slate-700 text-white px-6 py-2 rounded-lg hover:opacity-90 text-sm">Save Skills List</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. PORTFOLIO TAB */}
                {activeTab === "PORTFOLIO" && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="flex justify-between items-center pb-4 border-b dark:border-zinc-800">
                            <h2 className="text-xl font-bold">Portfolio Projects</h2>
                            <a href="/portfolio" target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                Preview Page ↗
                            </a>
                        </div>

                        {/* Editor */}
                        <div className="bg-slate-50 dark:bg-zinc-800/30 border border-dashed border-gray-300 dark:border-zinc-700 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                                {isEditing ? "✏️ Edit Project" : "➕ Add New Project"}
                            </h3>

                            <div className="grid md:grid-cols-[1fr_300px] gap-6">
                                <div className="space-y-4">
                                    <input
                                        placeholder="Project Title"
                                        className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800"
                                        value={projectForm.title}
                                        onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="Project Description"
                                        className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800"
                                        rows={3}
                                        value={projectForm.description}
                                        onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            placeholder="Tags (comma separated)"
                                            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800"
                                            value={projectForm.tags}
                                            onChange={e => setProjectForm({ ...projectForm, tags: e.target.value })}
                                        />
                                        <input
                                            placeholder="Project Link (Optional)"
                                            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800"
                                            value={projectForm.link}
                                            onChange={e => setProjectForm({ ...projectForm, link: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-lg h-full flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900">
                                        {projectForm.imageUrl ? (
                                            <div className="relative w-full h-32 mb-2 rounded overflow-hidden">
                                                <img src={projectForm.imageUrl} alt="Preview" className="object-cover w-full h-full" />
                                            </div>
                                        ) : (
                                            <div className="text-gray-300 text-4xl mb-2">📷</div>
                                        )}
                                        <input type="file" onChange={(e) => handleImageUpload(e, "project")} className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={handleSaveProject}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                    disabled={saving || uploading}
                                >
                                    {isEditing ? "Update Project" : "Create Project"}
                                </button>
                                {isEditing && (
                                    <button
                                        onClick={() => {
                                            setIsEditing(null)
                                            setProjectForm({ title: "", description: "", imageUrl: "", tags: "", link: "" })
                                        }}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* List */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(project => (
                                <div key={project.id} className="group relative bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg transition-all dark:hover:border-zinc-600">
                                    <div className="h-48 bg-gray-100 dark:bg-zinc-800 relative">
                                        {project.imageUrl && (
                                            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button onClick={() => handleEditProject(project)} className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100">✏️</button>
                                            <button onClick={() => handleDeleteProject(project.id)} className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600">🗑️</button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg">{project.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{project.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. CONTACT TAB */}
                {activeTab === "CONTACT" && (
                    <div className="space-y-6 animate-fade-in-up text-center py-12">
                        <div className="flex justify-between items-center pb-4 border-b dark:border-zinc-800 mb-8">
                            <h2 className="text-xl font-bold">Contact Page Configuration</h2>
                            <a href="/contact" target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                Preview Page ↗
                            </a>
                        </div>
                        <div className="max-w-md mx-auto p-8 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-2xl">
                            <div className="text-4xl mb-4">📬</div>
                            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                            <p className="text-gray-500">
                                You can add direct contact details like Email, Phone, or Social Links here in the future.
                                <br />Currently, the contact page uses a static form.
                            </p>
                        </div>
                    </div>
                )}

                {/* 5. GLOBAL TAB */}
                {activeTab === "GLOBAL" && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="pb-4 border-b dark:border-zinc-800">
                            <h2 className="text-xl font-bold">Global Website Settings</h2>
                        </div>
                        <div className="max-w-2xl">
                            <label className="block text-sm font-medium mb-1">Footer Text</label>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={configs.footer_text || ""}
                                    placeholder="e.g. © 2026 My Website"
                                    onChange={e => setConfigs({ ...configs, footer_text: e.target.value })}
                                />
                                <button onClick={() => handleSaveConfig("footer_text")} className="bg-slate-900 dark:bg-slate-700 text-white px-4 rounded-lg hover:opacity-90">Save</button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">This text appears at the bottom of every page.</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
