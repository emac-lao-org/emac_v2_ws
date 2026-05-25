# AGENTS.md

This file defines module-level guidance for `/Users/toxin999/emac_wt/emac-ws/emac-ws`.

## Read With

Use together with:

- `/Users/toxin999/emac_wt/AGENTS.md`
- `/Users/toxin999/emac_wt/PROJECT_STATE.md`
- `/Users/toxin999/emac_wt/project-map.md`
- `/Users/toxin999/emac_wt/COMMON_COMMANDS.md`

## Module Purpose

`emac-ws/emac-ws` is the WS web app.

Main responsibilities:

- WS-side manifest oversight
- manifest list / tracking / approve pages
- Waste Details dictionary management
- waste category management
- reporting/dashboard views
- WS-side certify action when WR is not available

## Build / Run

Root:
- `/Users/toxin999/emac_wt/emac-ws/emac-ws`

Commands:

```bash
cd /Users/toxin999/emac_wt/emac-ws/emac-ws
npm run dev
```

```bash
cd /Users/toxin999/emac_wt/emac-ws/emac-ws
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

## Architecture Notes

This app is an older Nuxt 2 + Vue 2 + Vuetify 2 codebase with many page-local GraphQL queries and UI-driven status logic.

Important implications:

- UI state and query shape are tightly coupled
- manifest status is often derived in page/component logic, not only from a single backend field
- changing a GraphQL field shape often requires touching multiple pages
- some runtime issues come from config/auth/endpoint problems, not only component code

## High-Risk Areas

Treat these files as high-risk and often cross-coupled:

- `/Users/toxin999/emac_wt/emac-ws/emac-ws/components/manifest/tableManifest.vue`
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/pages/manifest/tracking/index.vue`
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/pages/manifest/approve/index.vue`
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/pages/wd/manifest/index.vue`
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/pages/waste_category_names.vue`
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/components/manage_waste_categories/tableCategories.vue`
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/nuxt.config.js`
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/plugins/firebase-auth.js`
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/middleware/auth.js`
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/store/index.js`
- manifest-related GraphQL under:
  - `/Users/toxin999/emac_wt/emac-ws/emac-ws/gql/queries/manifest`
  - `/Users/toxin999/emac_wt/emac-ws/emac-ws/gql/mutations/manifest`

If one of these changes, expect follow-up impact elsewhere.

## Active WS Rules

### Waste Details

- `/waste_category_names` is now a `Waste Details` dictionary page
- It is not a strict WG request-approval gate anymore
- Treat `waste_category_names` as a central list tied to waste code
- Use `status` as dictionary state:
  - `1 = active`
  - `9 = inactive`
- Prefer activate/deactivate over destructive delete

### Waste Code Display

- If `entry_type = 'Hz'`, display waste code as `code + '*'`
- Keep DB raw code unchanged
- Apply formatting only in UI display or formatter layer

### WS Certify

- `WS` can certify manifest when `WR` is not available
- WS certify persists to:
  - `emac.manifests.ws_certify_user`
  - `emac.qr_codes.ws_certify_date`
- Do not reuse `ws_user` for WS certify actor tracking
- WS certify should update actor/date, not status only

### Shared Certify Display Rule

Across WS pages:

- if `wr_user` exists, show WR actor/date
- else if `ws_certify_user` exists, show WS actor/date

Do not assume the final actor is always WR.

## WS Manifest Logic

### Main Manifest Table

Main entry:
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/components/manifest/tableManifest.vue`

This file is critical because it controls:

- server-side paging
- filter UI
- manifest status display chip logic
- reset-to-draft action
- certify action
- export flow
- navigation into detail/tracking pages

Be careful when editing:

- status names are UI-derived strings
- filter logic and status logic are coupled
- certify action must stay aligned with DB schema and permissions

### Status Display

The app commonly derives display statuses such as:

- `Requested`
- `Ready`
- `WT Processing`
- `WD Processing`
- `Completed`
- `Certified`
- denial/reject variants
- `Expired`

If changing manifest status rules, check both:

- query/result mapping
- chip rendering logic

### Detail / Tracking Pages

Primary pages:

- `/Users/toxin999/emac_wt/emac-ws/emac-ws/pages/manifest/tracking/index.vue`
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/pages/manifest/approve/index.vue`
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/pages/wd/manifest/index.vue`

When changing manifest actor/date fields, verify:

- query field exists
- local fallback logic exists
- template displays the correct actor/date pair

## Waste Details Page Rules

Main entry:
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/pages/waste_category_names.vue`

Current intended behavior:

- create/edit Waste Details entries
- choose `entry_type` first
- then choose waste code by autocomplete
- show standard waste name
- maintain active/inactive state

Be careful about:

- prefilled `waste_cat_id` from route query
- type change resetting selected code when incompatible
- autocomplete source list filtering
- status wording staying aligned with actual business usage

Do not reintroduce old pending/approved/rejected workflow unless explicitly requested.

## Waste Category Management

Main area:
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/components/manage_waste_categories`

Important file:
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/components/manage_waste_categories/tableCategories.vue`

Use this area for:

- central waste code management
- linking into Waste Details management

When changing waste category display:

- preserve `Hz -> code*` display rule
- do not mutate stored raw code

## Query / Mapping Rules

WS often uses page-local or component-local GraphQL files.

If adding or changing fields:

1. update GraphQL query/mutation
2. update page/component logic consuming it
3. update template slots or computed fields
4. verify filters/search/export still work

This is especially important for manifest pages because:

- actor/date fields may be shown in multiple places
- export and table display often use different mapped fields

## Auth / Apollo / Runtime Config Notes

Important files:

- `/Users/toxin999/emac_wt/emac-ws/emac-ws/nuxt.config.js`
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/plugins/firebase-auth.js`
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/middleware/auth.js`
- `/Users/toxin999/emac_wt/emac-ws/emac-ws/store/index.js`

Known characteristics:

- Apollo endpoint config lives in `nuxt.config.js`
- this app has historically been sensitive to endpoint misconfiguration
- `firebase-auth.js` refreshes token via `onIdTokenChanged`
- route/auth behavior should be checked after auth-related changes

When seeing `Network error: Failed to fetch`, check first:

1. HTTP endpoint
2. websocket config consistency
3. local Hasura availability
4. auth token freshness

Do not assume every runtime error is a component bug.

## Reporting / Dashboard Notes

WS also contains report/dashboard flows using waste code summaries.

If changing waste code presentation:

- preserve `Hz -> code*` formatting in report/dashboard too
- do not alter raw code values in backend-facing logic unless explicitly required

Some report/dashboard pages rely on view/function outputs rather than direct table relations.

Be careful with:

- `pages/report.vue`
- dashboard waste code charts
- queries built from DB views or SQL functions

## Common Pitfalls

- updating a manifest field in one page query but not the other WS pages
- changing certify flow without updating actor/date display fallback
- using `ws_user` instead of `ws_certify_user`
- reintroducing old Waste Details approval assumptions
- changing UI labels but not matching page behavior
- forgetting export/table mapping after changing field names
- treating endpoint/auth problems as UI bugs

## Validation Expectations

After changes in this module, prefer checking:

1. app build passes
2. target page loads without GraphQL/runtime errors
3. table/filter/search still function
4. if manifest fields changed, actor/date fallback still works
5. if Waste Details changed, create/edit/activate/deactivate still works
6. if certify changed, WS can see the result immediately on WS pages

## Recommended Task Patterns For WS

- `WS /waste_category_names: analyze only`
- `WS manifest table: implement + build`
- `WS certify flow: delta only`
- `WS tracking page: fix actor/date fallback`
- `WS report: check Hz display only`

