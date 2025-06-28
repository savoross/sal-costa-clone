"use client"

import { useState, Suspense } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navigation/navbar"
import { CursorFollower } from "@/components/cursor/cursor-follower"
import { RealProgressLoader } from "@/components/loading/real-progress-loader"
import { HomeClient } from "./home-client"

// Lazy load non-critical components
const BlobBackground = dynamic(
  () => import("@/components/background/blob-background").then((mod) => ({ default: mod.BlobBackground })),
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

const skills = ["Web Design", "UX Design", "Frontend Development", "React Development", "TypeScript", "UI/UX Design"]

// Optimized asset preloading - only critical images
const CRITICAL_ASSETS = {
  images: [
    "https://ext.same-assets.com/4083826418/1092142111.jpeg", // About page hero
  ],
  fonts: ["Plus Jakarta Sans"],
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
        minLoadTime={1500} // Reduced for better UX
      />
    )
  }

  return (
    <div className="page-wrapper home">
      <CursorFollower />
      <Suspense fallback={null}>
        <BlobBackground />
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
