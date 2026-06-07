# Cloudflare Pages Deploy Checklist for WS

Use this checklist when deploying `WS` to Cloudflare Pages.

## Project Setup

- Framework preset: `None`
- Root directory: `emac-ws/emac-ws`
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `16`

## Required Environment Variables

Set these in both Preview and Production unless you intentionally want different values:

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

- `GRAPHQL_HTTP_ENDPOINT` must be `https://...`
- Do not use `http://178.105.223.212:8080/v1/graphql` on `pages.dev`

## Pre-Deploy Checks

- `.nvmrc` is `16`
- `npm install` passes on Node 16
- `npm ci` passes on Node 16
- `npm run build` passes on Node 16
- `dist/` is generated
- Apollo config is HTTP-only

## Deploy Flow

1. Push the latest WS branch to GitHub.
2. Create or update the Cloudflare Pages project.
3. Fill in the build settings from this file.
4. Add all required environment variables.
5. Trigger a deploy.

## Post-Deploy Smoke Test

- Open the `*.pages.dev` URL
- Confirm login page loads
- Confirm manifest tracking / approve pages still load data
- Confirm Waste Details page still loads
- Check browser console for blocked mixed-content or CORS errors
- Confirm GraphQL requests go to `https://...`, not `http://...`

## Troubleshooting

- If build fails during dependency install, confirm Cloudflare is using `Node 16`
- If the site loads but data requests fail, confirm `GRAPHQL_HTTP_ENDPOINT` is `https://...`
- If routes 404 on deep links, confirm the generated output includes `200.html`
