# Sal Costa Clone

This repository contains a recreation of **Sali Cost's** personal portfolio. It leverages modern React tooling to showcase interactive animations, WebGL backgrounds and a responsive design.

## Technologies

- **Next.js 15** with React 19
- **TypeScript**
- **Tailwind CSS** and Radix UI components
- **Framer Motion** and **GSAP** for animations

The project can be run using either `pnpm` or `bun`.

## Local development

```bash
pnpm install   # or `bun install`
pnpm dev       # or `bun run dev`
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Building for production

```bash
pnpm run build # or `bun run build`
pnpm start     # or `bun run start`
```

A Netlify configuration is included for easy deployment.

## Progressive Web App

The site is installable as a PWA. The `public/manifest.json` file defines icons and metadata, while `public/sw.js` implements a service worker that caches static assets, handles offline navigation and supports background sync and push notifications.
