// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@pinia/nuxt", "@sidebase/nuxt-auth"],
  // extends: ["@nuxt/ui-pro"],
  auth: {
    provider: {
      type: "authjs",
    },
  },
  nitro: {
    experimental: {
      websocket: true,
    },
    preset: "aws-amplify",
  },
  runtimeConfig: {
    public: {
      auth: {
        // @ts-ignore
        computed: {
          origin: process.env.NEXTAUTH_URL || process.env.AUTH_ORIGIN,
        },
      },
    },
  },
});
