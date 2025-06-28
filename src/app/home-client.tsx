"use client"

import { SaliCostLogo } from "@/components/logo/sali-cost-logo"
import Link from "next/link"
import { useEffect, useState } from "react"

export function HomeClient() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className={`home-content-wrapper ${isLoaded ? "loaded" : ""}`}>
      <SaliCostLogo />

      <div className="home-link-wrapper">
        <Link href="/work" className="home-link text-large" data-cursor-hover aria-label="Посмотреть мои работы">
          посмотреть мои работы
        </Link>

        <Link href="/contact" className="home-link text-large" data-cursor-hover aria-label="Связаться со мной">
          связаться со мной
        </Link>
      </div>
    </main>
  )
}
