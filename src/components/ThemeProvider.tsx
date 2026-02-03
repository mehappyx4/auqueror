"use client"

import { useEffect, useState } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeLoaded, setThemeLoaded] = useState(false)

    useEffect(() => {
        // Fetch theme settings from API
        async function loadTheme() {
            try {
                const res = await fetch('/api/theme')
                if (res.ok) {
                    const theme = await res.json()

                    // Apply CSS variables to document root
                    const root = document.documentElement

                    if (theme.primaryColor) {
                        root.style.setProperty('--color-primary', theme.primaryColor)
                    }

                    if (theme.secondaryColor) {
                        root.style.setProperty('--color-secondary', theme.secondaryColor)
                    }

                    if (theme.fontFamily) {
                        root.style.setProperty('--font-family', theme.fontFamily)
                    }

                    if (theme.backgroundImage) {
                        root.style.setProperty('--theme-background-image', `url(${theme.backgroundImage})`)
                    } else {
                        root.style.setProperty('--theme-background-image', 'none')
                    }

                    setThemeLoaded(true)
                }
            } catch (error) {
                console.error('Failed to load theme:', error)
                setThemeLoaded(true) // Still render even if theme fails
            }
        }

        loadTheme()
    }, [])

    return <>{children}</>
}
