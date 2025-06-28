"use client";

import { useEffect, useRef } from "react";

interface SkillsMarqueeProps {
  skills: string[];
}

export function SkillsMarquee({ skills }: SkillsMarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marqueeContent = marqueeRef.current;
    if (!marqueeContent) return;

    // Clone the content to create the continuous effect
    const cloneContent = () => {
      const clonedItems = Array.from(marqueeContent.children).map(child =>
        child.cloneNode(true) as HTMLElement
      );

      clonedItems.forEach(item => {
        marqueeContent.appendChild(item);
      });
    };

    cloneContent();
  }, []);

  return (
    <div className="marquee-wrapper">
      <div ref={marqueeRef} className="marquee-content">
        {skills.map((skill, index) => (
          <div key={index} className="marquee-item">
            <div className="marquee-dot"></div>
            <div className="text-sm">{skill}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
