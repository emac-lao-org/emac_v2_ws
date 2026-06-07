# EMAC WS

`WS` is the Waste Staff web app in this workspace.

## Local Development

Recommended runtime:

- `Node.js 16`
- `npm`

Commands:

```bash
nvm use
npm install
npm run dev
```

Default dev server:

- `http://localhost:3000`

## Build

For Cloudflare Pages and other static hosting:

```bash
npm run build
```

This runs `nuxt generate` and writes the static output to `dist/`.

## Environment Variables

Required app environment variables:

```text
MAPBOX_ACCESS_TOKEN=
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
GRAPHQL_HTTP_ENDPOINT=
```

Important:

- `GRAPHQL_HTTP_ENDPOINT` must be `https://...` when `WS` is deployed to `https://...pages.dev`
- `http://...` GraphQL endpoints are fine for local development but will be blocked by browsers on deployed HTTPS pages
- `WS` now runs HTTP-only in Apollo config; it no longer requires `GRAPHQL_WS_ENDPOINT`

## Cloudflare Pages

`WS` should be deployed as a static site.

Recommended Cloudflare Pages settings:

- Framework preset: `None`
- Root directory: `emac-ws/emac-ws`
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `16`

See [CLOUDFLARE_PAGES_DEPLOY_CHECKLIST.md](/Users/toxin999/emac_wt/emac-ws/emac-ws/CLOUDFLARE_PAGES_DEPLOY_CHECKLIST.md) for the full deploy checklist.
