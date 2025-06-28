"use client";

import { AnimatedLogo } from "@/components/logo/animated-logo";
import { SkillsMarquee } from "@/components/marquee/skills-marquee";
import { Navbar } from "@/components/navigation/navbar";
import { CursorFollower } from "@/components/cursor/cursor-follower";
import { BlobBackground } from "@/components/background/blob-background";
import Link from "next/link";
import { useEffect, useState } from "react";

const skills = [
  "Web Design",
  "UX Design",
  "Frontend Development",
  "Web Design",
  "UX Design",
  "Frontend Development",
  "Web Design",
  "UX Design",
  "Frontend Development",
];

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="page-wrapper home">
      <CursorFollower />
      <BlobBackground />
      <Navbar />

      <main className={`home-content-wrapper ${isLoaded ? 'loaded' : ''}`}>
        <AnimatedLogo />

        <div className="home-link-wrapper">
          <Link
            href="/work"
            className="home-link text-large"
            data-cursor-hover
            aria-label="See my work"
          >
            see my work
          </Link>

          <Link
            href="/contact"
            className="home-link text-large"
            data-cursor-hover
            aria-label="Contact me"
          >
            get in touch
          </Link>
        </div>
      </main>

      <SkillsMarquee skills={skills} />
    </div>
  );
}
