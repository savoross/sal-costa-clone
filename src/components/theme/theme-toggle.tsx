"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="switch-wrapper" aria-label="Toggle theme">
        <img
          src="https://ext.same-assets.com/4083826418/3962489012.svg"
          alt=""
          width={20}
          height={20}
          style={{ width: '20px', height: '20px' }}
        />
      </button>
    );
  }

  return (
    <button
      className="switch-wrapper"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      data-cursor-hover
    >
      <img
        src={theme === "dark"
          ? "https://ext.same-assets.com/4083826418/3962489012.svg"
          : "https://ext.same-assets.com/4083826418/3962489012.svg"
        }
        alt=""
        width={20}
        height={20}
        style={{ width: '20px', height: '20px' }}
      />
    </button>
  );
}
