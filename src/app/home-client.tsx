"use client"

import { AnimatedLogo } from "@/components/logo/animated-logo"
import Link from "next/link"
import { useEffect, useState } from "react"

export function HomeClient() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className={`home-content-wrapper ${isLoaded ? "loaded" : ""}`}>
      <AnimatedLogo />

      <div className="home-link-wrapper">
        <Link href="/work" className="home-link text-large" data-cursor-hover aria-label="See my work">
          see my work
        </Link>

        <Link href="/contact" className="home-link text-large" data-cursor-hover aria-label="Contact me">
          get in touch
        </Link>
      </div>
    </main>
  )
}
