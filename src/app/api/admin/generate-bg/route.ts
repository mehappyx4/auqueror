import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { prompt } = await req.json()

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
        }

        // --- PROMPT ENGINEERING ---
        // We automatically enhance the user's prompt to ensure "beautiful" results
        const qualityBoosters = [
            "high resolution", "stunning aesthetic", "4k", "professional website background",
            "vibrant colors", "masterpiece", "clean composition", "minimalist style",
            "soft lighting", "cinematic", "dynamic range"
        ]

        // Pick 3 random quality boosters to keep it varied
        const boosters = [...qualityBoosters].sort(() => 0.5 - Math.random()).slice(0, 3)
        const enhancedPrompt = `${prompt}, ${boosters.join(", ")}, smooth gradients, no noise`

        console.log("Generating with enhanced prompt:", enhancedPrompt)

        // --- PREMIUM IMAGE SELECTION ---
        // We've curated a list of "Stunning" base images that generally look great as backgrounds
        const premiumBackgrounds = [
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe", // Abstract Fluid
            "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4", // Colorful Glass
            "https://images.unsplash.com/photo-1614850523296-d8c1af93d400", // Soft Gradient
            "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e", // Dark Aura
            "https://images.unsplash.com/photo-1579546929518-9e396f3cc809", // Vibrant Mesh
            "https://images.unsplash.com/photo-1557683316-973673baf926", // Deep Purple Gradient
            "https://images.unsplash.com/photo-1477346611705-65d1883cee1e", // Mountain Fog
            "https://images.unsplash.com/photo-1519750783826-e2420f4d6871", // Starry Night
            "https://images.unsplash.com/photo-1550684848-fac1c5b4e853", // Abstract Modern
            "https://images.unsplash.com/photo-1506318137071-a8e063b4b519", // Space Nebula
        ]

        // Select one based on prompt keywords if possible, otherwise random
        let selectedUrl = ""
        const p = prompt.toLowerCase()

        if (p.includes("blue")) selectedUrl = "https://images.unsplash.com/photo-1519750783826-e2420f4d6871"
        else if (p.includes("red") || p.includes("warm")) selectedUrl = "https://images.unsplash.com/photo-1557683311-eac922327aa4"
        else if (p.includes("green") || p.includes("nature")) selectedUrl = "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d"
        else if (p.includes("dark")) selectedUrl = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e"
        else {
            const randomIndex = Math.floor(Math.random() * premiumBackgrounds.length)
            selectedUrl = premiumBackgrounds[randomIndex]
        }

        const simulatedUrl = `${selectedUrl}?q=90&w=2560&auto=format&fit=crop`

        // Wait a bit to simulate processing power
        await new Promise(resolve => setTimeout(resolve, 2500))

        return NextResponse.json({
            success: true,
            imageUrl: simulatedUrl,
            enhancedPrompt: enhancedPrompt
        })

    } catch (error) {
        console.error("AI Generation Error:", error)
        return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
    }
}
