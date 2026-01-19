# Github Users

Search and view GitHub users with a PWA-enabled Vite + React app.

## Requirements

- Node.js 18+ (LTS recommended)
- npm (or your preferred package manager)

## Install

```bash
npm install
```

## Run the app (dev)

```bash
npm run dev
```

Vite prints the local URL (usually `http://localhost:5173`).

## Build

```bash
npm run build
```

## Test PWA with preview

The PWA service worker is only generated for production builds, so use `preview` to test it:

```bash
npm run build
npm run preview
```

Open the preview URL and verify the Service Worker and cache in browser devtools.

## Run tests

```bash
 npm test -- --run
```
