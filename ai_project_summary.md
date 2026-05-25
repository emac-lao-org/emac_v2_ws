# EMAC-WS (Environmental Management Administration Cloud - Waste System)

**Project Name**: emac_ws_auth
**Description**: A comprehensive waste management system portal acting as an administrative and operations platform. It facilitates interactions between various roles involved in the waste lifecycle: generation, transportation, disposal, and regulation.

## Tech Stack
- **Framework**: Nuxt.js 2 (Vue.js 2 for frontend UI)
- **State Management**: Vuex (`store/`)
- **UI Library**: Vuetify.js (`@nuxtjs/vuetify`)
- **Styling**: SCSS (`assets/variables.scss`), Custom Phetsarath OT font.
- **Backend / Database Integration**:
  - **Apollo GraphQL**: Connected to `https://api-graphql.emac-lao.com/v1/graphql` for primary data operations (Queries/Mutations/Subscriptions over WS).
  - **Firebase**: Connected to `emac-cloud-wayha` for Authentication and Storage services.
- **Maps / Geolocation**: Mapbox GL integration (`@mapbox/mapbox-gl-geocoder`)
- **Charting**: ApexCharts / vue-apexcharts
- **Localization (i18n)**: Supports English (en) and Lao (la) via `@nuxtjs/i18n`.
- **Other utilities**: Moment.js, Crypto-js, SweetAlert2, V-Calendar, Object-to-CSV.

## Key Modules & Roles
The application pages (`pages/`) indicate the system has dedicated dashboards/features for different entities:
1. **Waste Generator** (`waste_generator.vue`)
2. **Waste Transporter** (`waste_transporter.vue`)
3. **Waste Disposal** (`waste_disposal.vue`)
4. **Waste Regulator** (`waste_regulator.vue`)
5. **Waste Staff** (`waste_staff.vue`)

## Core Features
1. **Manifest System** (`pages/manifest/`): Likely tracks waste transportation from generator to disposal.
2. **Waste Catalog / Categories** (`pages/waste_catalog/`, `manage_waste_categories.vue`): Manages the types of waste handled.
3. **Company Management** (`pages/company_management/`): For managing the companies registered in the system under the different roles.
4. **Data Entry & Logs** (`data_entry_log_recording_system.vue`): Audit and tracking system.
5. **Reporting**: Includes charting via ApexCharts and PDF generation integrations (`vue-pdf-embed`).
6. **Billing / Top-up** (`top_up_emac_ims_system_credit.vue`): Handling IMS system credits/finances.

## Useful Entry Points for AI Review
- **Configuration**: `nuxt.config.js` and `package.json`
- **GraphQL APIs**: Queries and mutations are located in the `gql/` directory.
- **Layouts**: The navigation drawer and app structure are defined in `layouts/default.vue`.
- **Pages**: Check `pages/index.vue` and specific role pages like `pages/waste_generator.vue` for the main workflows.
- **Components**: The `components/` folder holds reusable UI parts.
