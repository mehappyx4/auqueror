"use client"

import { useEffect, useState } from "react"

export function StarField() {
    const [stars, setStars] = useState<{ left: string, top: string, delay: string, size: string }[]>([])

    useEffect(() => {
        const newStars = [...Array(30)].map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: `${Math.random() * 5}s`,
            size: Math.random() > 0.8 ? '3px' : '1.5px',
        }))
        setStars(newStars)
    }, [])

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {stars.map((star, i) => (
                <div
                    key={i}
                    className="star-point"
                    style={{
                        left: star.left,
                        top: star.top,
                        animationDelay: star.delay,
                        width: star.size,
                        height: star.size,
                    }}
                />
            ))}
        </div>
    )
}
