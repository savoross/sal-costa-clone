"use client"

import { RealProgressLoader } from "./real-progress-loader"

interface PageSpecificLoaderProps {
  onComplete?: () => void
  pageType: "home" | "work" | "about" | "contact"
}

const PAGE_ASSETS = {
  home: {
    images: ["https://ext.same-assets.com/4083826418/1092142111.jpeg"],
    fonts: ["Plus Jakarta Sans"],
    scripts: [],
  },
  work: {
    images: [
      "https://ext.same-assets.com/4083826418/779204435.png",
      "https://ext.same-assets.com/4083826418/354791880.png",
      "https://ext.same-assets.com/4083826418/1936394737.png",
      "https://ext.same-assets.com/4083826418/3629516342.png",
      "https://ext.same-assets.com/4083826418/843157461.png",
    ],
    fonts: ["Plus Jakarta Sans"],
    scripts: [],
  },
  about: {
    images: ["https://ext.same-assets.com/4083826418/1092142111.jpeg"],
    fonts: ["Plus Jakarta Sans"],
    scripts: [],
  },
  contact: {
    images: [],
    fonts: ["Plus Jakarta Sans"],
    scripts: [],
  },
}

export function PageSpecificLoader({ onComplete, pageType }: PageSpecificLoaderProps) {
  const assets = PAGE_ASSETS[pageType]

  return (
    <RealProgressLoader
      onComplete={onComplete}
      images={assets.images}
      fonts={assets.fonts}
      scripts={assets.scripts}
      minLoadTime={1500}
    />
  )
}
