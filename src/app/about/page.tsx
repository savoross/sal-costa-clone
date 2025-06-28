"use client"

import { Navbar } from "@/components/navigation/navbar"
import { CursorFollower } from "@/components/cursor/cursor-follower"
import { BlobBackground } from "@/components/background/blob-background"
import { SkillsMarquee } from "@/components/marquee/skills-marquee"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { AboutClient } from "./about-client"

const skills = ["Web Design", "UX Design", "Frontend Development", "Web Design", "UX Design", "Frontend Development"]

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="page-wrapper">
      <CursorFollower />
      <BlobBackground />
      <Navbar />

      <main className="w-full max-w-screen-xl mx-auto py-24 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8">About Me</h1>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg mb-4">
                I'm Sal Costa, a Frontend Developer and Designer with over 5 years of experience crafting digital
                experiences that blend creativity with technical precision.
              </p>
              <p className="mb-4">
                My approach combines intuitive user interfaces with clean, efficient code to create websites and
                applications that not only look beautiful but perform flawlessly.
              </p>
              <p className="mb-4">
                I specialize in React ecosystems, UI/UX design, and animation, bringing brands and ideas to life through
                thoughtful digital design and development.
              </p>
              <p className="mb-4">
                When I'm not coding or designing, you'll find me exploring new design trends, experimenting with
                animations, or contributing to open source projects.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Core Skills</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">Development</h3>
                  <ul className="space-y-1">
                    <li>React & Next.js</li>
                    <li>TypeScript</li>
                    <li>GSAP & Framer Motion</li>
                    <li>Tailwind CSS</li>
                    <li>Responsive Design</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Design</h3>
                  <ul className="space-y-1">
                    <li>UI/UX Design</li>
                    <li>Figma & Adobe Suite</li>
                    <li>Motion Design</li>
                    <li>Design Systems</li>
                    <li>Interaction Design</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="rounded-lg overflow-hidden">
                <img
                  src="https://ext.same-assets.com/4083826418/1092142111.jpeg"
                  alt="Sal Costa"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-secondary text-secondary-foreground p-4 rounded-lg">
                <p className="font-medium">Available for freelance projects</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <AboutClient />
      <SkillsMarquee skills={skills} />
    </div>
  )
}
