"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function CursorFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [tooltipContent, setTooltipContent] = useState<{ type: string; content: string | null }>({
    type: "",
    content: null,
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseLeave = () => {
      setIsHidden(true)
    }

    const handleMouseEnter = () => {
      setIsHidden(false)
    }

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.hasAttribute("data-cursor-hover")) {
        setIsHovering(true)
      }

      // Check for tooltip content
      if (target.hasAttribute("data-cursor-tooltip")) {
        const tooltipType = target.getAttribute("data-cursor-tooltip-type") || "text"
        const content = target.getAttribute("data-cursor-tooltip")
        setTooltipContent({ type: tooltipType, content })
      }
    }

    const handleHoverEnd = () => {
      setIsHovering(false)
      setTooltipContent({ type: "", content: null })
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseover", handleHoverStart)
    document.addEventListener("mouseout", handleHoverEnd)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseover", handleHoverStart)
      document.removeEventListener("mouseout", handleHoverEnd)
    }
  }, [])

  if (typeof window === "undefined") return null

  return (
    <motion.div
      className={`cursor-follower ${isHovering ? "hover" : ""} ${isHidden ? "hidden" : ""}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {tooltipContent.content && (
        <div className={`tooltip ${tooltipContent.type} ${tooltipContent.content ? "active" : ""}`}>
          {tooltipContent.type === "image" ? <img src={tooltipContent.content || ""} alt="" /> : tooltipContent.content}
        </div>
      )}
    </motion.div>
  )
}

// Named export for compatibility
export { CursorFollower as default }
