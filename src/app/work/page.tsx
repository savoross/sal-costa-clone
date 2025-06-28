import { Navbar } from "@/components/navigation/navbar"
import { CursorFollower } from "@/components/cursor/cursor-follower"
import { BlobBackground } from "@/components/background/blob-background"
import { SkillsMarquee } from "@/components/marquee/skills-marquee"
import { WorkClient } from "./work-client"

const skills = ["Web Design", "UX Design", "Frontend Development", "Web Design", "UX Design", "Frontend Development"]

export const projects = [
  {
    id: 1,
    title: "Arcex",
    description: "UX/UI Design & Development",
    imageUrl: "https://ext.same-assets.com/4083826418/779204435.png",
    tags: ["UI Design", "Frontend Development"],
    year: "2024",
  },
  {
    id: 2,
    title: "Raindrop",
    description: "Web Design & Development",
    imageUrl: "https://ext.same-assets.com/4083826418/354791880.png",
    tags: ["Web Design", "Frontend Development"],
    year: "2023",
  },
  {
    id: 3,
    title: "Finterest",
    description: "UX/UI Design & Development",
    imageUrl: "https://ext.same-assets.com/4083826418/1936394737.png",
    tags: ["UI Design", "Frontend Development"],
    year: "2023",
  },
  {
    id: 4,
    title: "Portfolio",
    description: "UX/UI Design & Development",
    imageUrl: "https://ext.same-assets.com/4083826418/3629516342.png",
    tags: ["UI Design", "Frontend Development"],
    year: "2022",
  },
  {
    id: 5,
    title: "Venture Out",
    description: "Web Design & Development",
    imageUrl: "https://ext.same-assets.com/4083826418/843157461.png",
    tags: ["Web Design", "Frontend Development"],
    year: "2022",
  },
]

export default function WorkPage() {
  return (
    <div className="page-wrapper">
      <CursorFollower />
      <BlobBackground />
      <Navbar />
      <WorkClient projects={projects} />
      <SkillsMarquee skills={skills} />
    </div>
  )
}
