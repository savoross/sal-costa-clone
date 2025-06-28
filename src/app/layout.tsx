import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { ClientBody } from "./ClientBody"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  preload: true,
})

export const metadata: Metadata = {
  title: "Sal Costa - Full Stack Frontend Developer & Designer",
  description: "Experienced curator of digital user experiences. Specializing in React and web platforms.",
  keywords: ["frontend developer", "web designer", "react developer", "ui/ux designer"],
  authors: [{ name: "Sal Costa" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#f7f4ed",
  manifest: "/manifest.json",
  openGraph: {
    title: "Sal Costa - Full Stack Frontend Developer & Designer",
    description: "Experienced curator of digital user experiences. Specializing in React and web platforms.",
    type: "website",
    locale: "en_US",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sal Costa",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ext.same-assets.com" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sal Costa" />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  )
}
