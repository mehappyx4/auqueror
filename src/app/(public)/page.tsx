import { prisma } from "@/lib/prisma"
import Link from "next/link"


export const dynamic = "force-dynamic"

export default async function Home() {
  const configs = await prisma.siteConfig.findMany()
  const configMap = configs.reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
    acc[curr.key] = curr.value
    return acc
  }, {} as Record<string, string>)

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* 1. Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        {/* Dynamic Hero Background Image */}
        {configMap.hero_image ? (
          <div className="absolute inset-0 w-full h-full">
            <img src={configMap.hero_image} alt="Hero Background" className="w-full h-full object-cover opacity-20 dark:opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-slate-950/50 dark:to-slate-950"></div>
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        )}

        <div className="z-10 max-w-4xl space-y-8 animate-fade-in-up relative">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {configMap.hero_title || "[Your Name]"}
            </h1>
            <p className="text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-400">
              {configMap.hero_subtitle || "Creative Designer | Full-stack Developer"}
            </p>
          </div>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {configMap.hero_description || "Turning ideas into innovation with over [Number] years of experience in [Field]."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/portfolio" className="px-8 py-3.5 rounded-full bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/30">
              View My Work
            </Link>
            <Link href="/contact" className="px-8 py-3.5 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              Contact Me
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
