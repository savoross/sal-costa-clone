# Sal Costa Portfolio Clone

This project replicates [Sal Costa](https://example.com)'s personal portfolio using **Next.js** and **TypeScript**. It showcases WebGL particle animations and provides a Progressive Web App experience through an advanced service worker.

## Features

- **WebGL Particle Background** with a graceful DOM fallback for browsers without WebGL 2 support.
- **Service Worker** caching strategies for offline access, including network-first and cache-first rules, plus optional background sync.
- **Offline & Network Indicators** to inform users when connectivity changes or a new version is available.
- **Tailwind CSS** with shadcn/ui components for styling.

## Getting Started

Install dependencies and start the development server:

```bash
bun install
bun run dev
```

Open `http://localhost:3000` in your browser to view the site. The service worker does not register in development unless explicitly enabled.

### Building for Production

```bash
bun run build
bun run start
```

## Environment Variables

- `NEXT_PUBLIC_SW_ENABLED`: set to `true` to force service worker registration during development. In production the worker is registered automatically.

## Deployment

The repository contains a `netlify.toml` configuration. Netlify runs `bun run build` and publishes the `.next` directory. You can also deploy to any platform that supports Next.js by running the build and serving the output with `bun run start`.

## License

This project is licensed under the [MIT License](./LICENSE).
