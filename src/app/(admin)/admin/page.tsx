"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { HeroPreview, AboutPreview, ContactPreview } from "@/components/admin/PreviewComponents"
import { useLanguage } from "@/components/LanguageProvider"

type ConfigItem = {
    key: string
    value: string
}

type Project = {
    id: string
    title: string
    title_th?: string
    description: string
    description_th?: string
    imageUrl: string
    tags: string
    link?: string
}

type User = {
    id: string
    name: string | null
    email: string
    role: string
    createdAt: Date
}



type TimelineItem = {
    id: string
    year: string
    title: string
    title_th?: string
    description: string
    description_th?: string
    color: string
    order: number
}

type Tab = "HOME" | "ABOUT" | "PORTFOLIO" | "CONTACT" | "SOCIAL" | "USERS" | "THEME" | "GLOBAL"


export default function AdminDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { language, setLanguage, t } = useLanguage()

    const [activeTab, setActiveTab] = useState<Tab>("HOME")

    // Config State
    const [configs, setConfigs] = useState<Record<string, string>>({
        hero_title: "",
        hero_title_th: "",
        hero_subtitle: "",
        hero_subtitle_th: "",
        hero_description: "",
        hero_description_th: "",
        hero_image: "",
        about_me: "",
        about_me_th: "",
        about_image: "",
        skills_list: "",
        skills_strategic: "",
        footer_text: "",
        footer_text_th: "",
        // Contact
        contact_title: "",
        contact_title_th: "",
        contact_subtitle: "",
        contact_subtitle_th: "",
        contact_description: "",
        contact_description_th: "",
        contact_email: "",
        contact_phone: "",
        contact_address: "",
        contact_address_th: "",
        // Social Media
        social_github: "",
        social_linkedin: "",
        social_twitter: "",
        social_facebook: "",
        social_instagram: "",

        // Theme
        theme_primary_color: "#3b82f6",
        theme_secondary_color: "#8b5cf6",
        theme_font_family: "Inter",
        theme_background_image: "",

        // Timeline
        about_timeline: "",
    })

    // AI Generation State
    const [aiPrompt, setAiPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)

    // Users State
    const [users, setUsers] = useState<User[]>([])
    const [showUserForm, setShowUserForm] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [userForm, setUserForm] = useState({ email: "", password: "", name: "", role: "USER" })



    // Projects State
    const [projects, setProjects] = useState<Project[]>([])
    const [isEditing, setIsEditing] = useState<string | null>(null)
    const [projectForm, setProjectForm] = useState<Omit<Project, 'id'>>({
        title: "",
        title_th: "",
        description: "",
        description_th: "",
        imageUrl: "",
        tags: "",
        link: ""
    })

    // Timeline State
    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
    const [showTimelineForm, setShowTimelineForm] = useState(false)
    const [editingTimeline, setEditingTimeline] = useState<TimelineItem | null>(null)
    const [timelineForm, setTimelineForm] = useState({ year: "", title: "", title_th: "", description: "", description_th: "", color: "blue" })

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
                fetchUsers()
                fetchTimelineItems()
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
                setConfigs(prev => {
                    const next = { ...prev, ...configMap }
                    // Update lists from configs

                    if (configMap.about_timeline) {
                        try { setTimelineItems(JSON.parse(configMap.about_timeline)) } catch (e) { }
                    }
                    return next
                })
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

    // Fetch Users
    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users")
            if (res.ok) {
                const data = await res.json()
                setUsers(data)
            }
        } catch (error) {
            console.error("Failed to fetch users", error)
        }
    }

    // Fetch Navigation Items


    // Timeline Management Handlers
    const fetchTimelineItems = async () => {
        try {
            const timelineData = configs.about_timeline
            if (timelineData) {
                const items = JSON.parse(timelineData)
                setTimelineItems(items)
            }
        } catch (error) {
            console.error("Failed to parse timeline items", error)
        }
    }

    const handleSaveTimeline = async () => {
        setSaving(true)
        try {
            const res = await fetch("/api/admin/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: "about_timeline", value: JSON.stringify(timelineItems) })
            })
            if (res.ok) {
                setMessage("Timeline saved successfully")
                setTimeout(() => setMessage(""), 3000)
            }
        } catch (error) {
            setMessage("Error saving timeline")
        } finally {
            setSaving(false)
        }
    }

    const handleAddTimelineItem = () => {
        if (!timelineForm.year || !timelineForm.title) {
            setMessage("Year and Title required")
            return
        }
        const newItem: TimelineItem = {
            id: Date.now().toString(),
            ...timelineForm,
            order: timelineItems.length + 1
        }
        setTimelineItems([...timelineItems, newItem])
        setTimelineForm({ year: "", title: "", title_th: "", description: "", description_th: "", color: "blue" })
        setShowTimelineForm(false)
        setMessage("Item added (click Save to persist)")
    }

    const handleEditTimelineItem = (item: TimelineItem) => {
        setEditingTimeline(item)
        setTimelineForm({
            year: item.year,
            title: item.title,
            title_th: item.title_th || "",
            description: item.description,
            description_th: item.description_th || "",
            color: item.color
        })
        setShowTimelineForm(true)
    }

    const handleUpdateTimelineItem = () => {
        if (!editingTimeline) return
        const updated = timelineItems.map(item =>
            item.id === editingTimeline.id ? { ...item, ...timelineForm } : item
        )
        setTimelineItems(updated)
        setEditingTimeline(null)
        setTimelineForm({ year: "", title: "", title_th: "", description: "", description_th: "", color: "blue" })
        setShowTimelineForm(false)
        setMessage("Item updated (click Save to persist)")
    }

    const handleDeleteTimelineItem = (id: string) => {
        if (!confirm("Delete this timeline item?")) return
        setTimelineItems(timelineItems.filter(item => item.id !== id))
        setMessage("Item deleted (click Save to persist)")
    }

    const handleMoveTimelineItem = (index: number, direction: number) => {
        const newIndex = index + direction
        if (newIndex < 0 || newIndex >= timelineItems.length) return
        const newItems = [...timelineItems]
        const temp = newItems[index]
        newItems[index] = newItems[newIndex]
        newItems[newIndex] = temp
        // Update order
        newItems.forEach((item, idx) => item.order = idx + 1)
        setTimelineItems(newItems)
        setMessage("Reordered (click Save to persist)")
    }

    // User Management Handlers
    const handleCreateUser = async () => {
        if (!userForm.email || !userForm.password) {
            setMessage("Email and password required")
            return
        }
        setSaving(true)
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userForm)
            })
            if (res.ok) {
                setMessage("User created successfully")
                setShowUserForm(false)
                setUserForm({ email: "", password: "", name: "", role: "USER" })
                fetchUsers()
                setTimeout(() => setMessage(""), 3000)
            } else {
                const data = await res.json()
                setMessage(data.error || "Failed to create user")
            }
        } catch (error) {
            setMessage("Error creating user")
        } finally {
            setSaving(false)
        }
    }

    const handleEditUser = (user: User) => {
        setEditingUser(user)
        setUserForm({ email: user.email, password: "", name: user.name || "", role: user.role })
        setShowUserForm(true)
    }

    const handleUpdateUser = async () => {
        if (!editingUser) return
        setSaving(true)
        try {
            const updateData: any = { id: editingUser.id, email: userForm.email, name: userForm.name, role: userForm.role }
            if (userForm.password) {
                updateData.password = userForm.password
            }
            const res = await fetch("/api/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData)
            })
            if (res.ok) {
                setMessage("User updated successfully")
                setShowUserForm(false)
                setEditingUser(null)
                setUserForm({ email: "", password: "", name: "", role: "USER" })
                fetchUsers()
                setTimeout(() => setMessage(""), 3000)
            } else {
                setMessage("Failed to update user")
            }
        } catch (error) {
            setMessage("Error updating user")
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return
        setSaving(true)
        try {
            const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                setMessage("User deleted successfully")
                fetchUsers()
                setTimeout(() => setMessage(""), 3000)
            } else {
                const data = await res.json()
                setMessage(data.error || "Failed to delete user")
            }
        } catch (error) {
            setMessage("Error deleting user")
        } finally {
            setSaving(false)
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
        const file = e.target.files[0]
        console.log("🚀 Starting upload process for:", file.name, { target, configKey })

        if (file.size > 4.5 * 1024 * 1024) {
            alert("File is too large! Please use an image smaller than 4.5MB.");
            e.target.value = ""; // Reset input
            return;
        }

        setUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            })

            console.log("🛰️ Server response status:", res.status)

            // Handle unexpected non-JSON responses (like 413 Payload Too Large)
            if (!res.ok) {
                const errorText = await res.text()
                console.error("❌ Upload request failed:", errorText)

                let errorMessage = "Upload failed"
                if (res.status === 413) {
                    errorMessage = "File too large! Vercel limits uploads to 4.5MB."
                } else {
                    try {
                        const errorJson = JSON.parse(errorText)
                        errorMessage = errorJson.error || errorMessage
                    } catch (e) {
                        errorMessage = `Server Error (${res.status})`
                    }
                }
                alert(`Upload Failed: ${errorMessage}`)
                return
            }

            const data = await res.json()
            console.log("✅ Upload data received:", data)

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
            } else if (data.error) {
                let errorMsg = `Upload Failed: ${data.details || data.error}`
                if (data.sql_fix) {
                    errorMsg += `\n\nREQUIRED ACTION: Copy and run this SQL in your Supabase SQL Editor:\n\n${data.sql_fix}`
                } else if (data.action_plan === "Bucket Required") {
                    errorMsg += `\n\nHINT: Please create a public bucket named 'uploads' in your Supabase Dashboard.`
                }
                alert(errorMsg)
            }
        } catch (error: any) {
            console.error("💥 Critical error in handleImageUpload:", error)
            alert(`Critical error: ${error.message || "Network Error"}`)
        } finally {
            setUploading(false)
            // Reset input so the same file can be selected again if needed
            e.target.value = ""
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
                setProjectForm({
                    title: "",
                    title_th: "",
                    description: "",
                    description_th: "",
                    imageUrl: "",
                    tags: "",
                    link: ""
                })
                setIsEditing(null)
                setTimeout(() => setMessage(""), 3000)
            }
        } catch (error) {
            console.error("Failed to save project", error)
        } finally {
            setSaving(false)
        }
    }

    const handleGenerateBackground = async () => {
        if (!aiPrompt) return alert("Please enter a prompt")

        setIsGenerating(true)
        try {
            // Note: In a real app, this would be an API call that calls the AI tool
            // For this simulation, we simulate the tool call and result
            const res = await fetch("/api/admin/generate-bg", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: aiPrompt })
            })

            if (res.ok) {
                const data = await res.json()
                setConfigs(prev => ({ ...prev, theme_background_image: data.imageUrl, hero_image: data.imageUrl }))

                // Automatically save to hero_image (Primary) and theme_background_image (Legacy)
                await handleSaveConfig("hero_image")
                await handleSaveConfig("theme_background_image")

                if (data.enhancedPrompt) {
                    setAiPrompt(`✨ Enhanced: ${data.enhancedPrompt}`)
                }
                alert("Background generated and applied to Home Page!")
            } else {
                alert("Failed to generate background")
            }
        } catch (error) {
            console.error("Failed to generate background", error)
            alert("Error generating background")
        } finally {
            setIsGenerating(false)
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
            title_th: project.title_th || "",
            description: project.description,
            description_th: project.description_th || "",
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
        { id: "HOME", label: t("Home", "หน้าแรก") },
        { id: "ABOUT", label: t("About", "เกี่ยวกับ") },
        { id: "PORTFOLIO", label: t("Portfolio", "ผลงาน") },
        { id: "CONTACT", label: t("Contact", "ติดต่อ") },

        { id: "SOCIAL", label: t("Social Media", "โซเชียลมีเดีย") },
        { id: "USERS", label: t("Users", "ผู้ใช้งาน") },

        { id: "THEME", label: t("Theme", "ธีมเว็บ") },
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
            <div className="flex items-center justify-between mb-6 bg-white dark:bg-zinc-900 p-1 rounded-xl shadow-sm">
                <div className="flex space-x-1 overflow-x-auto flex-1">
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

                {/* Language Toggle in Tab Bar */}
                <div className="flex items-center bg-gray-100 dark:bg-black/20 rounded-lg p-1 border border-gray-200 dark:border-white/5 ml-4">
                    <button
                        onClick={() => setLanguage("en")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black transition-all ${language === "en" ? "bg-white dark:bg-blue-600 text-black dark:text-white shadow-md" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
                    >
                        🇺🇸 EN
                    </button>
                    <button
                        onClick={() => setLanguage("th")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black transition-all ${language === "th" ? "bg-white dark:bg-blue-600 text-black dark:text-white shadow-md" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
                    >
                        🇹🇭 TH
                    </button>
                </div>
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
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">主 Hero Title (EN)</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                                value={configs.hero_title || ""}
                                                onChange={e => setConfigs({ ...configs, hero_title: e.target.value })}
                                            />
                                            <button onClick={() => handleSaveConfig("hero_title")} className="bg-slate-900 dark:bg-slate-700 text-white px-3 rounded-lg hover:opacity-90">Save</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">🇹🇭 Hero Title (TH)</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                                value={configs.hero_title_th || ""}
                                                onChange={e => setConfigs({ ...configs, hero_title_th: e.target.value })}
                                            />
                                            <button onClick={() => handleSaveConfig("hero_title_th")} className="bg-slate-900 dark:bg-slate-700 text-white px-3 rounded-lg hover:opacity-90">Save</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">🎞️ Hero Subtitle (EN)</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all text-xs uppercase tracking-widest"
                                                value={configs.hero_subtitle || ""}
                                                onChange={e => setConfigs({ ...configs, hero_subtitle: e.target.value })}
                                            />
                                            <button onClick={() => handleSaveConfig("hero_subtitle")} className="bg-slate-900 dark:bg-slate-700 text-white px-3 rounded-lg hover:opacity-90">Save</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">🇹🇭 Hero Subtitle (TH)</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all text-xs uppercase tracking-widest"
                                                value={configs.hero_subtitle_th || ""}
                                                onChange={e => setConfigs({ ...configs, hero_subtitle_th: e.target.value })}
                                            />
                                            <button onClick={() => handleSaveConfig("hero_subtitle_th")} className="bg-slate-900 dark:bg-slate-700 text-white px-3 rounded-lg hover:opacity-90">Save</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">📝 Hero Description (EN)</label>
                                        <div className="flex gap-2">
                                            <textarea
                                                className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                                rows={3}
                                                value={configs.hero_description || ""}
                                                onChange={e => setConfigs({ ...configs, hero_description: e.target.value })}
                                            />
                                            <div className="flex flex-col justify-end">
                                                <button onClick={() => handleSaveConfig("hero_description")} className="h-10 bg-slate-900 dark:bg-slate-700 text-white px-3 rounded-lg hover:opacity-90">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">🇹🇭 Hero Description (TH)</label>
                                        <div className="flex gap-2">
                                            <textarea
                                                className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                                rows={3}
                                                value={configs.hero_description_th || ""}
                                                onChange={e => setConfigs({ ...configs, hero_description_th: e.target.value })}
                                            />
                                            <div className="flex flex-col justify-end">
                                                <button onClick={() => handleSaveConfig("hero_description_th")} className="h-10 bg-slate-900 dark:bg-slate-700 text-white px-3 rounded-lg hover:opacity-90">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Hero Image Upload */}
                            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <span>🖼️ Hero Background Image</span>
                                </h3>

                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-1 w-full">
                                        <div className="border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-all cursor-pointer relative group">
                                            <input
                                                type="file"
                                                id="hero-upload"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => handleImageUpload(e, "config", "hero_image")}
                                            />
                                            <div className="space-y-3">
                                                <div className="text-4xl group-hover:scale-110 transition-transform">📤</div>
                                                <div className="font-medium">Click to upload new background</div>
                                                <div className="text-xs text-gray-400">Recommended: 1920x1080px (Max 4.5MB)</div>
                                            </div>
                                        </div>
                                    </div>

                                    {configs.hero_image && (
                                        <div className="w-full md:w-64">
                                            <div className="text-sm font-medium mb-2">Current Image:</div>
                                            <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 group">
                                                <img src={configs.hero_image} alt="Hero Background" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <a href={configs.hero_image} target="_blank" className="text-white text-xs hover:underline">View Full</a>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        <HeroPreview
                            title={configs.hero_title || ""}
                            subtitle={configs.hero_subtitle || ""}
                            description={configs.hero_description || ""}
                            image={configs.hero_image || ""}
                        />
                    </div>
                )
                }

                {/* 2. ABOUT TAB */}
                {
                    activeTab === "ABOUT" && (
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
                                    <div className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">📖 Biography (EN)</label>
                                                <div className="flex gap-2">
                                                    <textarea
                                                        className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                                        rows={8}
                                                        placeholder="Tell your story..."
                                                        value={configs.about_me || ""}
                                                        onChange={e => setConfigs({ ...configs, about_me: e.target.value })}
                                                    />
                                                    <div className="flex flex-col justify-end">
                                                        <button onClick={() => handleSaveConfig("about_me")} className="h-10 bg-slate-900 dark:bg-slate-700 text-white px-3 rounded-lg hover:opacity-90">Save</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">🇹🇭 Biography (TH)</label>
                                                <div className="flex gap-2">
                                                    <textarea
                                                        className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                                        rows={8}
                                                        placeholder="เล่าเรื่องราวของคุณ..."
                                                        value={configs.about_me_th || ""}
                                                        onChange={e => setConfigs({ ...configs, about_me_th: e.target.value })}
                                                    />
                                                    <div className="flex flex-col justify-end">
                                                        <button onClick={() => handleSaveConfig("about_me_th")} className="h-10 bg-slate-900 dark:bg-slate-700 text-white px-3 rounded-lg hover:opacity-90">Save</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-3">Profile Picture</label>
                                            <div className="border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-all group flex flex-col items-center justify-center text-center">
                                                <input
                                                    type="file"
                                                    id="about-image-upload"
                                                    className="hidden"
                                                    onChange={(e) => handleImageUpload(e, "config", "about_image")}
                                                />
                                                <label htmlFor="about-image-upload" className="cursor-pointer w-full flex flex-col items-center">
                                                    {configs.about_image ? (
                                                        <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-xl border-2 border-blue-500/20 group-hover:border-blue-500/50 transition-all">
                                                            <img src={configs.about_image} alt="Profile" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                                <span className="text-white text-xs font-bold uppercase tracking-widest">Change Signal</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center py-4">
                                                            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">📸</div>
                                                            <span className="text-sm font-medium text-gray-500 group-hover:text-blue-500 transition-colors">Upload Identity Visual</span>
                                                        </div>
                                                    )}
                                                </label>
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

                                <div>
                                    <label className="block text-sm font-medium mb-1">🧠 Strategic Skills</label>
                                    <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-slate-100 dark:border-zinc-800">
                                        <p className="text-xs text-gray-500 mb-2">Separate each strategic skill with a comma (e.g. Leadership, Strategy, Optimization)</p>
                                        <div className="flex gap-2">
                                            <textarea
                                                className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
                                                rows={4}
                                                value={configs.skills_strategic || ""}
                                                onChange={e => setConfigs({ ...configs, skills_strategic: e.target.value })}
                                            />
                                        </div>
                                        <div className="mt-2 text-right">
                                            <button onClick={() => handleSaveConfig("skills_strategic")} className="bg-slate-900 dark:bg-slate-700 text-white px-6 py-2 rounded-lg hover:opacity-90 text-sm">Save Strategic Skills</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <AboutPreview
                                aboutMe={configs.about_me || ""}
                                image={configs.about_image || ""}
                                skills={configs.skills_list || ""}
                                skillsStrategic={configs.skills_strategic || ""}
                                timeline={timelineItems}
                            />

                            {/* Timeline Editor */}
                            <div className="pt-12 border-t dark:border-zinc-800">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold">Chronological Orbit Editor</h3>
                                    <button
                                        onClick={() => { setEditingTimeline(null); setTimelineForm({ year: "", title: "", title_th: "", description: "", description_th: "", color: "blue" }); setShowTimelineForm(true) }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                                    >
                                        + Add Event
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {timelineItems.length === 0 ? (
                                        <div className="text-center py-10 border-2 border-dashed dark:border-zinc-700 rounded-xl text-gray-400">
                                            No timeline events recorded. Click "Add Event" to start orbiting.
                                        </div>
                                    ) : (
                                        timelineItems.map((item, index) => (
                                            <div key={item.id} className="flex items-center gap-4 p-4 glass-card border dark:border-zinc-800 rounded-xl hover:bg-zinc-800/20 transition-all">
                                                <div className="flex flex-col gap-1">
                                                    <button onClick={() => handleMoveTimelineItem(index, -1)} disabled={index === 0} className="text-xs hover:scale-125 disabled:opacity-20">▲</button>
                                                    <button onClick={() => handleMoveTimelineItem(index, 1)} disabled={index === timelineItems.length - 1} className="text-xs hover:scale-125 disabled:opacity-20">▼</button>
                                                </div>
                                                <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: item.color === 'blue' ? '#3b82f6' : item.color === 'pink' ? '#ec4899' : '#a855f7' }}>
                                                    <span className="text-[10px] font-bold uppercase">{item.year.split(' ')[0]}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-white">{item.title}</div>
                                                    <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEditTimelineItem(item)} className="p-2 hover:bg-blue-500/10 rounded-lg text-blue-400 transition-all">✏️</button>
                                                    <button onClick={() => handleDeleteTimelineItem(item.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-all">🗑️</button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {timelineItems.length > 0 && (
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={handleSaveTimeline}
                                            disabled={saving}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
                                        >
                                            {saving ? "Deploying..." : "💾 Save Timeline"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Timeline Event Modal */}
                            {showTimelineForm && (
                                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={() => setShowTimelineForm(false)}>
                                    <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl max-w-lg w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                                        <h3 className="text-2xl font-bold mb-6 text-white">{editingTimeline ? "Edit Event" : "Launch New Event"}</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Orbit Year/Duration</label>
                                                    <input
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="e.g. 2018 - 2022"
                                                        value={timelineForm.year}
                                                        onChange={e => setTimelineForm({ ...timelineForm, year: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Cosmic Color</label>
                                                    <select
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none"
                                                        value={timelineForm.color}
                                                        onChange={e => setTimelineForm({ ...timelineForm, color: e.target.value })}
                                                    >
                                                        <option value="blue">Electric Blue</option>
                                                        <option value="pink">Nebula Pink</option>
                                                        <option value="purple">Quantum Purple</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Mission Title (EN)</label>
                                                    <input
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="e.g. Stellar Academy"
                                                        value={timelineForm.title}
                                                        onChange={e => setTimelineForm({ ...timelineForm, title: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">🇹🇭 Mission Title (TH)</label>
                                                    <input
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="ชื่อภารกิจ"
                                                        value={timelineForm.title_th}
                                                        onChange={e => setTimelineForm({ ...timelineForm, title_th: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Mission Description (EN)</label>
                                                    <textarea
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-32"
                                                        placeholder="Describe the journey..."
                                                        value={timelineForm.description}
                                                        onChange={e => setTimelineForm({ ...timelineForm, description: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">🇹🇭 Mission Description (TH)</label>
                                                    <textarea
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-32"
                                                        placeholder="คำอธิบายภารกิจ..."
                                                        value={timelineForm.description_th}
                                                        onChange={e => setTimelineForm({ ...timelineForm, description_th: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-4 pt-4">
                                                <button
                                                    onClick={editingTimeline ? handleUpdateTimelineItem : handleAddTimelineItem}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all"
                                                >
                                                    {editingTimeline ? "Update" : "Add to Orbit"}
                                                </button>
                                                <button
                                                    onClick={() => setShowTimelineForm(false)}
                                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }

                {/* 3. PORTFOLIO TAB */}
                {
                    activeTab === "PORTFOLIO" && (
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
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Project Title (EN)</label>
                                                <input
                                                    placeholder="e.g. Project Alpha"
                                                    className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800"
                                                    value={projectForm.title}
                                                    onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">🇹🇭 Project Title (TH)</label>
                                                <input
                                                    placeholder="ชื่อโปรเจกต์"
                                                    className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800"
                                                    value={projectForm.title_th}
                                                    onChange={e => setProjectForm({ ...projectForm, title_th: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Description (EN)</label>
                                                <textarea
                                                    placeholder="Describe the project..."
                                                    className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800"
                                                    rows={3}
                                                    value={projectForm.description}
                                                    onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">🇹🇭 Description (TH)</label>
                                                <textarea
                                                    placeholder="คำอธิบายโปรเจกต์..."
                                                    className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800"
                                                    rows={3}
                                                    value={projectForm.description_th}
                                                    onChange={e => setProjectForm({ ...projectForm, description_th: e.target.value })}
                                                />
                                            </div>
                                        </div>
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
                                        <div className="border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl h-full min-h-[180px] flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 group hover:border-blue-500/50 transition-all">
                                            <input
                                                type="file"
                                                id="project-image-upload"
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(e, "project")}
                                            />
                                            <label htmlFor="project-image-upload" className="cursor-pointer w-full flex flex-col items-center">
                                                {projectForm.imageUrl ? (
                                                    <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden border border-white/10">
                                                        <img src={projectForm.imageUrl} alt="Preview" className="object-cover w-full h-full" />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                            <span className="text-white text-xs font-bold uppercase tracking-widest">Update Vision</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <div className="text-blue-500/50 text-5xl mb-3 group-hover:scale-110 transition-transform">🖼️</div>
                                                        <span className="text-sm font-semibold text-gray-500 group-hover:text-blue-500 transition-colors">Select Visual Data</span>
                                                    </div>
                                                )}
                                                {uploading && <div className="mt-2 text-xs text-blue-500 animate-pulse font-bold">Synchronizing...</div>}
                                            </label>
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
                    )
                }

                {/* 4. CONTACT TAB */}
                {
                    activeTab === "CONTACT" && (
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="flex justify-between items-center pb-4 border-b dark:border-zinc-800">
                                <div>
                                    <h2 className="text-xl font-bold">Contact Page Branding</h2>
                                    <p className="text-sm text-gray-500 mt-1">Customize the main text and headers of your contact page</p>
                                </div>
                                <a href="/contact" target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                    Preview Page ↗
                                </a>
                            </div>

                            {/* Top Branding Section */}
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">📡 Contact Title (EN)</label>
                                            <div className="flex gap-2">
                                                <input
                                                    className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                                    value={configs.contact_title || ""}
                                                    onChange={e => setConfigs({ ...configs, contact_title: e.target.value })}
                                                />
                                                <button onClick={() => handleSaveConfig("contact_title")} className="bg-slate-900 dark:bg-slate-700 text-white px-3 rounded-lg hover:opacity-90">Save</button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">🇹🇭 Contact Title (TH)</label>
                                            <div className="flex gap-2">
                                                <input
                                                    className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                                    value={configs.contact_title_th || ""}
                                                    onChange={e => setConfigs({ ...configs, contact_title_th: e.target.value })}
                                                />
                                                <button onClick={() => handleSaveConfig("contact_title_th")} className="bg-slate-900 dark:bg-slate-700 text-white px-3 rounded-lg hover:opacity-90">Save</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">🛰️ Contact Subtitle (EN)</label>
                                            <div className="flex gap-2">
                                                <input
                                                    className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all uppercase tracking-widest text-xs"
                                                    value={configs.contact_subtitle || ""}
                                                    onChange={e => setConfigs({ ...configs, contact_subtitle: e.target.value })}
                                                />
                                                <button onClick={() => handleSaveConfig("contact_subtitle")} className="bg-slate-900 dark:bg-slate-700 text-white px-3 rounded-lg hover:opacity-90">Save</button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">🇹🇭 Contact Subtitle (TH)</label>
                                            <div className="flex gap-2">
                                                <input
                                                    className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all uppercase tracking-widest text-xs"
                                                    value={configs.contact_subtitle_th || ""}
                                                    onChange={e => setConfigs({ ...configs, contact_subtitle_th: e.target.value })}
                                                />
                                                <button onClick={() => handleSaveConfig("contact_subtitle_th")} className="bg-slate-900 dark:bg-slate-700 text-white px-3 rounded-lg hover:opacity-90">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">📝 Description (EN)</label>
                                        <div className="flex gap-2">
                                            <textarea
                                                className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                                rows={3}
                                                value={configs.contact_description || ""}
                                                onChange={e => setConfigs({ ...configs, contact_description: e.target.value })}
                                            />
                                            <div className="flex flex-col justify-end">
                                                <button onClick={() => handleSaveConfig("contact_description")} className="h-10 bg-slate-900 dark:bg-slate-700 text-white px-3 rounded-lg hover:opacity-90">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">🇹🇭 Description (TH)</label>
                                        <div className="flex gap-2">
                                            <textarea
                                                className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                                rows={3}
                                                value={configs.contact_description_th || ""}
                                                onChange={e => setConfigs({ ...configs, contact_description_th: e.target.value })}
                                            />
                                            <div className="flex flex-col justify-end">
                                                <button onClick={() => handleSaveConfig("contact_description_th")} className="h-10 bg-slate-900 dark:bg-slate-700 text-white px-3 rounded-lg hover:opacity-90">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t dark:border-zinc-800 pt-8 mt-8">
                                <h2 className="text-xl font-bold mb-4">Direct Communication Nodes</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">📧 Email Address</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="email"
                                                    className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                                    placeholder="your@email.com"
                                                    value={configs.contact_email || ""}
                                                    onChange={e => setConfigs({ ...configs, contact_email: e.target.value })}
                                                />
                                                <button onClick={() => handleSaveConfig("contact_email")} className="bg-slate-900 dark:bg-slate-700 text-white px-4 rounded-lg hover:opacity-90">Save</button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">📱 Phone Number</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="tel"
                                                    className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                                    placeholder="+1 (555) 123-4567"
                                                    value={configs.contact_phone || ""}
                                                    onChange={e => setConfigs({ ...configs, contact_phone: e.target.value })}
                                                />
                                                <button onClick={() => handleSaveConfig("contact_phone")} className="bg-slate-900 dark:bg-slate-700 text-white px-4 rounded-lg hover:opacity-90">Save</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">📍 Address (EN)</label>
                                                <div className="flex gap-2">
                                                    <textarea
                                                        className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all font-mono text-xs"
                                                        rows={4}
                                                        placeholder="123 Main St..."
                                                        value={configs.contact_address || ""}
                                                        onChange={e => setConfigs({ ...configs, contact_address: e.target.value })}
                                                    />
                                                    <div className="flex flex-col justify-end">
                                                        <button onClick={() => handleSaveConfig("contact_address")} className="h-10 bg-slate-900 dark:bg-slate-700 text-white px-3 rounded-lg hover:opacity-90">Save</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">🇹🇭 Address (TH)</label>
                                                <div className="flex gap-2">
                                                    <textarea
                                                        className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all font-mono text-xs"
                                                        rows={4}
                                                        placeholder="123 ถนนหลัก..."
                                                        value={configs.contact_address_th || ""}
                                                        onChange={e => setConfigs({ ...configs, contact_address_th: e.target.value })}
                                                    />
                                                    <div className="flex flex-col justify-end">
                                                        <button onClick={() => handleSaveConfig("contact_address_th")} className="h-10 bg-slate-900 dark:bg-slate-700 text-white px-3 rounded-lg hover:opacity-90">Save</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }


                {/* 6. SOCIAL MEDIA TAB */}
                {
                    activeTab === "SOCIAL" && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="pb-4 border-b dark:border-zinc-800">
                                <h2 className="text-xl font-bold">Social Media Links</h2>
                                <p className="text-sm text-gray-500 mt-1">Connect your social media profiles</p>
                            </div>

                            <div className="max-w-2xl space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">🐙 GitHub</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="https://github.com/yourusername"
                                            value={configs.social_github || ""}
                                            onChange={e => setConfigs({ ...configs, social_github: e.target.value })}
                                        />
                                        <button onClick={() => handleSaveConfig("social_github")} className="bg-slate-900 dark:bg-slate-700 text-white px-4 rounded-lg hover:opacity-90">Save</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">💼 LinkedIn</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="https://linkedin.com/in/yourprofile"
                                            value={configs.social_linkedin || ""}
                                            onChange={e => setConfigs({ ...configs, social_linkedin: e.target.value })}
                                        />
                                        <button onClick={() => handleSaveConfig("social_linkedin")} className="bg-slate-900 dark:bg-slate-700 text-white px-4 rounded-lg hover:opacity-90">Save</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">🐦 Twitter / X</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="https://twitter.com/yourusername"
                                            value={configs.social_twitter || ""}
                                            onChange={e => setConfigs({ ...configs, social_twitter: e.target.value })}
                                        />
                                        <button onClick={() => handleSaveConfig("social_twitter")} className="bg-slate-900 dark:bg-slate-700 text-white px-4 rounded-lg hover:opacity-90">Save</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">📘 Facebook</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="https://facebook.com/yourpage"
                                            value={configs.social_facebook || ""}
                                            onChange={e => setConfigs({ ...configs, social_facebook: e.target.value })}
                                        />
                                        <button onClick={() => handleSaveConfig("social_facebook")} className="bg-slate-900 dark:bg-slate-700 text-white px-4 rounded-lg hover:opacity-90">Save</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">📷 Instagram</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="https://instagram.com/yourusername"
                                            value={configs.social_instagram || ""}
                                            onChange={e => setConfigs({ ...configs, social_instagram: e.target.value })}
                                        />
                                        <button onClick={() => handleSaveConfig("social_instagram")} className="bg-slate-900 dark:bg-slate-700 text-white px-4 rounded-lg hover:opacity-90">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* 7. USERS TAB */}
                {
                    activeTab === "USERS" && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex justify-between items-center pb-4 border-b dark:border-zinc-800">
                                <div>
                                    <h2 className="text-xl font-bold">User Management</h2>
                                    <p className="text-sm text-gray-500 mt-1">Manage website users and administrators</p>
                                </div>
                                <button
                                    onClick={() => { setEditingUser(null); setUserForm({ email: "", password: "", name: "", role: "USER" }); setShowUserForm(true) }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    + Add User
                                </button>
                            </div>

                            {/* Users Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-zinc-800">
                                            <th className="text-left p-3 border-b dark:border-zinc-700">Email</th>
                                            <th className="text-left p-3 border-b dark:border-zinc-700">Name</th>
                                            <th className="text-left p-3 border-b dark:border-zinc-700">Role</th>
                                            <th className="text-left p-3 border-b dark:border-zinc-700">Created</th>
                                            <th className="text-right p-3 border-b dark:border-zinc-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id} className="border-b dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                                <td className="p-3">{user.email}</td>
                                                <td className="p-3">{user.name || "-"}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === "ADMIN" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                                <td className="p-3 text-right space-x-2">
                                                    <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:text-blue-700 font-medium">Edit</button>
                                                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-700 font-medium">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {users.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        No users found. Click "Add User" to create one.
                                    </div>
                                )}
                            </div>

                            {/* Create/Edit User Modal */}
                            {showUserForm && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowUserForm(false)}>
                                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                                        <h3 className="text-xl font-bold mb-4">{editingUser ? "Edit User" : "Create New User"}</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800"
                                                    value={userForm.email}
                                                    onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Password {editingUser && "(leave blank to keep current)"}</label>
                                                <input
                                                    type="password"
                                                    className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800"
                                                    value={userForm.password}
                                                    onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Name (optional)</label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800"
                                                    value={userForm.name}
                                                    onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Role</label>
                                                <select
                                                    className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 p-2.5 dark:bg-zinc-800"
                                                    value={userForm.role}
                                                    onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                                                >
                                                    <option value="USER">User</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    onClick={editingUser ? handleUpdateUser : handleCreateUser}
                                                    disabled={saving}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium disabled:opacity-50"
                                                >
                                                    {saving ? "Saving..." : (editingUser ? "Update" : "Create")}
                                                </button>
                                                <button
                                                    onClick={() => setShowUserForm(false)}
                                                    className="flex-1 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 py-2 rounded-lg font-medium"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }

                {/* 7. THEME TAB */}
                {
                    activeTab === "THEME" && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="pb-4 border-b dark:border-zinc-800">
                                <h2 className="text-xl font-bold">Theme Settings</h2>
                                <p className="text-sm text-gray-500 mt-1">Customize the look and feel of your website</p>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <span>✨ AI Background Generator</span>
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">New</span>
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border border-gray-200 dark:border-zinc-700">
                                        <label className="block text-sm font-medium mb-2">Describe your desired background</label>
                                        <textarea
                                            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 p-3 dark:bg-zinc-900 mb-3 focus:ring-2 focus:ring-purple-500"
                                            rows={3}
                                            placeholder="e.g., A futuristic cyberpunk city with neon lights in deep blue and purple tones..."
                                            value={aiPrompt}
                                            onChange={e => setAiPrompt(e.target.value)}
                                        />
                                        <button
                                            onClick={handleGenerateBackground}
                                            disabled={isGenerating || !aiPrompt}
                                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <span className="animate-spin">⚡</span> Generating Magic...
                                                </>
                                            ) : (
                                                <>
                                                    <span>✨</span> Generate & Apply Background
                                                </>
                                            )}
                                        </button>
                                        <p className="text-xs text-gray-500 mt-2 text-center">
                                            Generates and applies image to both Hero Background and Theme Background
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 opacity-50 pointer-events-none filter grayscale">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Primary Color (Coming Soon)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                className="h-10 w-20 rounded cursor-pointer"
                                                value={configs.theme_primary_color || "#3b82f6"}
                                                onChange={e => setConfigs({ ...configs, theme_primary_color: e.target.value })}
                                                disabled
                                            />
                                            <input
                                                className="flex-1 rounded-lg border p-2"
                                                value={configs.theme_primary_color || "#3b82f6"}
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Font Family (Coming Soon)</label>
                                        <select
                                            className="w-full rounded-lg border p-2.5"
                                            value={configs.theme_font_family || "Inter"}
                                            onChange={e => setConfigs({ ...configs, theme_font_family: e.target.value })}
                                            disabled
                                        >
                                            <option value="Inter">Inter</option>
                                            <option value="Roboto">Roboto</option>
                                            <option value="Poppins">Poppins</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }





            </div >
        </div >
    )
}
