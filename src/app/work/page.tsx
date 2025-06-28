import { Navbar } from "@/components/navigation/navbar"
import { CursorFollower } from "@/components/cursor/cursor-follower"
import { WebGLFallbackBackground } from "@/components/background/webgl-fallback-background"
import { SkillsMarquee } from "@/components/marquee/skills-marquee"
import { WorkClient } from "./work-client"

const skills = ["Веб Дизайн", "UX Дизайн", "Frontend Разработка", "Веб Дизайн", "UX Дизайн", "Frontend Разработка"]

export const projects = [
  {
    id: 1,
    title: "Arcex",
    description: "UX/UI Дизайн и Разработка",
    imageUrl: "https://ext.same-assets.com/4083826418/779204435.png",
    tags: ["UI Дизайн", "Frontend Разработка"],
    year: "2024",
    slug: "arcex",
  },
  {
    id: 2,
    title: "Raindrop",
    description: "Веб Дизайн и Разработка",
    imageUrl: "https://ext.same-assets.com/4083826418/354791880.png",
    tags: ["Веб Дизайн", "Frontend Разработка"],
    year: "2023",
    slug: "raindrop",
  },
  {
    id: 3,
    title: "Finterest",
    description: "UX/UI Дизайн и Разработка",
    imageUrl: "https://ext.same-assets.com/4083826418/1936394737.png",
    tags: ["UI Дизайн", "Frontend Разработка"],
    year: "2023",
    slug: "finterest",
  },
  {
    id: 4,
    title: "Portfolio",
    description: "UX/UI Дизайн и Разработка",
    imageUrl: "https://ext.same-assets.com/4083826418/3629516342.png",
    tags: ["UI Дизайн", "Frontend Разработка"],
    year: "2022",
    slug: "portfolio",
  },
  {
    id: 5,
    title: "Venture Out",
    description: "Веб Дизайн и Разработка",
    imageUrl: "https://ext.same-assets.com/4083826418/843157461.png",
    tags: ["Веб Дизайн", "Frontend Разработка"],
    year: "2022",
    slug: "venture-out",
  },
]

export default function WorkPage() {
  return (
    <div className="page-wrapper">
      <CursorFollower />
      <WebGLFallbackBackground />
      <Navbar />
      <WorkClient projects={projects} />
      <SkillsMarquee skills={skills} />
    </div>
  )
}
