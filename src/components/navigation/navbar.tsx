"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "../theme/theme-toggle";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <header id="navbar-wrapper" className="navbar-wrapper">
        <div className="navbar-side">
          <Link href="/" data-cursor-hover>
            <span className={`text-large nav-details ${isMenuOpen ? "text-secondary" : ""}`}>
              Sal Costa
            </span>
          </Link>
        </div>
        <div className="navbar-side flex items-center gap-4">
          <ThemeToggle />
          <button
            className={`menu-button ${isMenuOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            data-cursor-hover
          >
            <span className="menu-button-line" />
            <span className="menu-button-line" />
            <span className="menu-button-line" />
          </button>
        </div>
      </header>

      <div id="navmenu-wrapper" className={isMenuOpen ? "open" : ""} aria-modal="true" aria-label="Navigation menu">
        <nav className="navmenu">
          <div className="navlink-wrapper">
            <motion.div
              className={`navlink link-0 ${pathname === "/" ? "current" : ""}`}
              style={{ "--index": 0 } as React.CSSProperties}
              tabIndex={isMenuOpen ? 0 : -1}
              aria-current={pathname === "/" ? "page" : undefined}
              onClick={() => handleNavigation("/")}
              data-cursor-hover
              initial={false}
              animate={isMenuOpen ? { y: 0 } : { y: "100%" }}
              transition={{ duration: 0.5, delay: 0 * 0.1 }}
            >
              <span className="navlink-text">Home</span>
            </motion.div>
          </div>
          <div className="navlink-wrapper">
            <motion.div
              className={`navlink link-1 ${pathname === "/work" ? "current" : ""}`}
              style={{ "--index": 1 } as React.CSSProperties}
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={() => handleNavigation("/work")}
              data-cursor-hover
              initial={false}
              animate={isMenuOpen ? { y: 0 } : { y: "100%" }}
              transition={{ duration: 0.5, delay: 1 * 0.1 }}
            >
              <span className="navlink-text">Work</span>
            </motion.div>
          </div>
          <div className="navlink-wrapper">
            <motion.div
              className={`navlink link-2 ${pathname === "/about" ? "current" : ""}`}
              style={{ "--index": 2 } as React.CSSProperties}
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={() => handleNavigation("/about")}
              data-cursor-hover
              initial={false}
              animate={isMenuOpen ? { y: 0 } : { y: "100%" }}
              transition={{ duration: 0.5, delay: 2 * 0.1 }}
            >
              <span className="navlink-text">About</span>
            </motion.div>
          </div>
          <div className="navlink-wrapper">
            <motion.div
              className={`navlink link-3 ${pathname === "/contact" ? "current" : ""}`}
              style={{ "--index": 3 } as React.CSSProperties}
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={() => handleNavigation("/contact")}
              data-cursor-hover
              initial={false}
              animate={isMenuOpen ? { y: 0 } : { y: "100%" }}
              transition={{ duration: 0.5, delay: 3 * 0.1 }}
            >
              <span className="navlink-text">Contact</span>
            </motion.div>
          </div>
          <motion.div
            className="social-icons-wrapper nav-details"
            initial={false}
            animate={isMenuOpen ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <a
              className="icon-link"
              href="https://www.behance.net/salcc"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={isMenuOpen ? 0 : -1}
              data-cursor-hover
            >
              BE
            </a>
            <a
              className="icon-link"
              href="https://www.linkedin.com/in/salcc/"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={isMenuOpen ? 0 : -1}
              data-cursor-hover
            >
              LI
            </a>
          </motion.div>
        </nav>
      </div>
    </>
  );
}
