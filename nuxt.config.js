import colors from 'vuetify/es5/util/colors'
require('dotenv').config()

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  databaseURL: process.env.FIREBASE_DATABASE_URL || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || '',
}

const graphqlHttpEndpoint =
  process.env.GRAPHQL_HTTP_ENDPOINT || 'http://localhost:8080/v1/graphql'
const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN || ''

export default {
  ssr: false,
  target: 'static',
  env: {
    MAPBOX_ACCESS_TOKEN: mapboxAccessToken,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'EMAC - WS',
    title: 'EMAC-WS',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      // { rel: 'stylesheet', href: '/assets/css/custom.css' },

      {
        rel: 'stylesheet',
        href: 'https://api.mapbox.com/mapbox-gl-js/v1.10.0/mapbox-gl.css',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [

  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vue-apexchar.js', ssr: false },
    { src: '~/plugins/v-calendar.js', ssr: false },
    { src: '~/plugins/firebase-auth.js', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules

  modules: [
    '@nuxt/content',
    '@nuxtjs/axios',
    '@nuxtjs/firebase',
    '@nuxtjs/apollo',
    '@nuxtjs/i18n',
  ],

  i18n: {
    locales: ['en', 'la'],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: require('./locales/en.json'),
        la: require('./locales/la.json'),
      },
    },
  },

  firebase: {
    config: firebaseConfig,

    services: {
      storage: true,
      auth: {
        persistence: 'local', // default
        initialize: {
          onAuthStateChangedAction: 'onAuthStateChangedAction',
          subscribeManually: false,
        },
      },
    },
  },

  apollo: {
    cookieAttributes: {
      expires: 7, // optional, default: 7 (days)
    },
    errorHandler: "~/plugins/apollo-error-handler.js",
    clientConfigs: {
      default: {
        httpEndpoint: graphqlHttpEndpoint,
        httpLinkOptions: {
          credentials: 'same-origin',
        },
        tokenName: 'token',
        authenticationType: 'Bearer',
        persisting: false,
      },
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },
  router: {
    middleware: ['auth'],
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      light: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: colors.blue.darken4, // #E53935 #0d47a1
          secondary: colors.blue.lighten4, // #FFCDD2
          accent: colors.indigo.base, // #3F51B5
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: [
      'vue-apexchart'
    ]
  },
  generate: {
    fallback: '200.html',
  },
}
