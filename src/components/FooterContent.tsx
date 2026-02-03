"use client"

import { useLanguage } from "@/components/LanguageProvider"

interface FooterContentProps {
    configMap: Record<string, string>
}

export default function FooterContent({ configMap }: FooterContentProps) {
    const { t } = useLanguage()

    return (
        <footer className="py-12 mt-12 text-center text-sm text-slate-400 glass-card border-t border-white/5 relative z-10">
            <div className="max-w-4xl mx-auto px-6">
                <p className="tracking-wide">
                    {t(
                        configMap.footer_text || "© 2026 Dark Star Portfolio. Built for the Cosmic Age.",
                        configMap.footer_text_th || configMap.footer_text || "© 2026 Dark Star Portfolio. สร้างขึ้นเพื่อยุคคอสมิก"
                    )}
                </p>
                <div className="mt-6 flex justify-center gap-6">
                    {configMap.social_github && (
                        <a href={configMap.social_github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            {t("GitHub", "กิตฮับ")}
                        </a>
                    )}
                    {configMap.social_linkedin && (
                        <a href={configMap.social_linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            {t("LinkedIn", "ลิงก์อิน")}
                        </a>
                    )}
                    {configMap.social_twitter && (
                        <a href={configMap.social_twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            {t("Twitter", "ทวิตเตอร์")}
                        </a>
                    )}
                </div>
                <div className="mt-8 text-xs">
                    <a href="/auth/admin-login" className="text-slate-600 hover:text-white transition-colors px-3 py-1 rounded-full border border-white/5 bg-white/5 cursor-pointer">
                        {t("Admin Access", "ทางเข้าแอดมิน")}
                    </a>
                </div>
            </div>
        </footer>
    )
}
