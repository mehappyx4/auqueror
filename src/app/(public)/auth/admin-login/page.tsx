"use client"

import { useState, useEffect } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminLogin() {
    const router = useRouter()
    const { data: session, status } = useSession()

    const [data, setData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Handle existing sessions
    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            if (session.user.role === "ADMIN") {
                router.replace("/admin")
            } else {
                // If logged in as USER but trying to access Admin Login, force logout or show error
                // Choosing to warn user and allow re-login
                setError("Logged in account is not an Admin. Please sign in with Admin credentials.")
            }
        }
    }, [status, session, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Ensure fresh login for admin
        if (status === "authenticated") {
            await signOut({ redirect: false })
        }

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
            })

            if (result?.error) {
                setError('Invalid admin credentials')
            } else {
                // Determine Role immediately
                const res = await fetch("/api/auth/session")
                const newSession = await res.json()

                if (newSession?.user?.role === "ADMIN") {
                    router.push('/admin')
                } else {
                    await signOut({ redirect: false })
                    setError("Access Denied: This account does not have Administrator privileges.")
                }
            }
        } catch (error) {
            setError('An error occurred during login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-zinc-400">Restricted Access</p>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-800 text-red-200 px-4 py-3 rounded mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="admin@example.com"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex justify-center items-center shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Sign In to Dashboard"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-zinc-800 pt-6">
                    <Link href="/" className="text-zinc-500 hover:text-white text-sm transition-colors">
                        ← Return to Website
                    </Link>
                </div>
            </div>
        </div>
    )
}
