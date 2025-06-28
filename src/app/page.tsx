"use client"

import { useState, Suspense } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navigation/navbar"
import { CursorFollower } from "@/components/cursor/cursor-follower"
import { RealProgressLoader } from "@/components/loading/real-progress-loader"
import { HomeClient } from "./home-client"

// Lazy load WebGL background with fallback
const WebGLFallbackBackground = dynamic(
  () =>
    import("@/components/background/webgl-fallback-background").then((mod) => ({
      default: mod.WebGLFallbackBackground,
    })),
  {
    ssr: false,
  },
)

const SkillsMarquee = dynamic(
  () => import("@/components/marquee/skills-marquee").then((mod) => ({ default: mod.SkillsMarquee })),
  {
    ssr: false,
  },
)

const skills = ["UX Дизайн", "UI Дизайн", "Frontend Разработка", "React Разработка", "TypeScript", "Веб Дизайн"]

// Optimized asset preloading - only critical images
const CRITICAL_ASSETS = {
  images: [
    "https://ext.same-assets.com/4083826418/1092142111.jpeg", // About page hero
  ],
  fonts: ["Inter"],
  scripts: [],
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <RealProgressLoader
        onComplete={handleLoadingComplete}
        images={CRITICAL_ASSETS.images}
        fonts={CRITICAL_ASSETS.fonts}
        scripts={CRITICAL_ASSETS.scripts}
        minLoadTime={1500}
      />
    )
  }

  return (
    <div className="page-wrapper home">
      <CursorFollower />
      <Suspense fallback={null}>
        <WebGLFallbackBackground />
      </Suspense>
      <Navbar />
      <HomeClient />
      <Suspense fallback={null}>
        <SkillsMarquee skills={skills} />
      </Suspense>
    </div>
  )
}

// Named export for compatibility
export { Page as HomePage }
