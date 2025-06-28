"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

export function AnimatedLogo() {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!logoRef.current) return;

    const letters = logoRef.current.querySelectorAll(".logo-letter");

    gsap.fromTo(letters,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2
      }
    );
  }, []);

  return (
    <div className="logo-wrapper" ref={logoRef}>
      <motion.div className="logo-text">
        <div className="logo-letter">S</div>
        <div className="logo-letter">A</div>
        <div className="logo-letter">L</div>
        <div className="logo-letter">&nbsp;</div>
        <div className="logo-letter">C</div>
        <div className="logo-letter">O</div>
        <div className="logo-letter">S</div>
        <div className="logo-letter">T</div>
        <div className="logo-letter">A</div>
      </motion.div>
    </div>
  );
}
