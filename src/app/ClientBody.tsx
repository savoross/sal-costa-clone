"use client";

import { ThemeProvider } from "next-themes";
import type React from "react";

export function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
