import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientBody } from "./ClientBody"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  preload: true,
})

export const metadata: Metadata = {
  title: "SALI COST - Frontend Разработчик и Дизайнер",
  description: "Опытный куратор цифровых пользовательских интерфейсов. Специализируемся на React и веб-платформах.",
  keywords: ["frontend разработчик", "веб дизайнер", "react разработчик", "ui/ux дизайнер"],
  authors: [{ name: "SALI COST" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#faf8f3",
  manifest: "/manifest.json",
  openGraph: {
    title: "SALI COST - Frontend Разработчик и Дизайнер",
    description: "Опытный куратор цифровых пользовательских интерфейсов. Специализируемся на React и веб-платформах.",
    type: "website",
    locale: "ru_RU",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SALI COST",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
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
        <meta name="apple-mobile-web-app-title" content="SALI COST" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  )
}
