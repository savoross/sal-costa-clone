"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isHovering, setIsHovering] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<{ type: string; content: string | null }>({
    type: "",
    content: null,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.getAttribute("role") === "link" || target.tagName === "A" || target.closest("a") || target.closest("[role='link']")) {
        setIsHovering(true);

        // Check for data-tooltip attribute
        const tooltipElement = target.closest("[data-tooltip]") as HTMLElement;
        if (tooltipElement) {
          const tooltipType = tooltipElement.dataset.tooltipType || "text";
          const tooltipContent = tooltipElement.dataset.tooltip || null;
          setTooltipContent({ type: tooltipType, content: tooltipContent });
        }
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
      setTooltipContent({ type: "", content: null });
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <motion.div
      ref={cursorRef}
      className={`cursor-follower ${isHovering ? "hover" : ""}`}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {tooltipContent.content && (
        <div className={`tooltip ${tooltipContent.type} ${tooltipContent.content ? "active" : ""}`}>
          {tooltipContent.type === "image" && tooltipContent.content ? (
            <img src={tooltipContent.content} alt="" />
          ) : (
            tooltipContent.content
          )}
        </div>
      )}
    </motion.div>
  );
}
