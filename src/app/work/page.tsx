"use client";

import { Navbar } from "@/components/navigation/navbar";
import { CursorFollower } from "@/components/cursor/cursor-follower";
import { BlobBackground } from "@/components/background/blob-background";
import { SkillsMarquee } from "@/components/marquee/skills-marquee";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const skills = [
  "Web Design",
  "UX Design",
  "Frontend Development",
  "Web Design",
  "UX Design",
  "Frontend Development",
];

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  year: string;
}

const projects: Project[] = [
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
];

export default function WorkPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="page-wrapper">
      <CursorFollower />
      <BlobBackground />
      <Navbar />

      <main className="w-full max-w-screen-xl mx-auto py-24 px-6">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Selected Works
        </motion.h1>

        <div className="grid grid-cols-1 gap-8 md:gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="group relative rounded-lg overflow-hidden cursor-none bg-background/50 hover:bg-background border border-border transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              data-cursor-hover
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/3 flex-shrink-0">
                  <div className="rounded-md overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">{project.title}</h2>
                    <span className="text-sm text-muted-foreground">{project.year}</span>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={`${project.id}-${tag}`} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <SkillsMarquee skills={skills} />
    </div>
  );
}
