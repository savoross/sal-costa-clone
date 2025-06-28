"use client"

import { Navbar } from "@/components/navigation/navbar"
import { CursorFollower } from "@/components/cursor/cursor-follower"
import { WebGLFallbackBackground } from "@/components/background/webgl-fallback-background"
import { SkillsMarquee } from "@/components/marquee/skills-marquee"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { ContactClient } from "./contact-client"

const skills = ["Веб Дизайн", "UX Дизайн", "Frontend Разработка", "Веб Дизайн", "UX Дизайн", "Frontend Разработка"]

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="page-wrapper">
      <CursorFollower />
      <WebGLFallbackBackground />
      <Navbar />

      <main className="w-full max-w-screen-xl mx-auto py-24 px-6">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Связаться с нами
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-lg mb-6">
              Мы всегда открыты для обсуждения новых проектов, креативных идей или возможностей стать частью вашего
              видения.
            </p>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Контактные данные</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-secondary">Email:</span>
                  <a
                    href="mailto:hello@salicost.dev"
                    className="hover:text-secondary transition-colors"
                    data-cursor-hover
                  >
                    hello@salicost.dev
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-secondary">Местоположение:</span>
                  <span>Москва, Россия</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Социальные сети</h2>
              <div className="flex gap-4">
                <a
                  href="https://www.behance.net/salcc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-foreground flex items-center justify-center transition-colors duration-300 hover:bg-secondary hover:border-secondary"
                  data-cursor-hover
                >
                  BE
                </a>
                <a
                  href="https://www.linkedin.com/in/salcc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-foreground flex items-center justify-center transition-colors duration-300 hover:bg-secondary hover:border-secondary"
                  data-cursor-hover
                >
                  LI
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ContactClient />
          </motion.div>
        </div>
      </main>

      <SkillsMarquee skills={skills} />
    </div>
  )
}
