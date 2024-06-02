// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  extends: ["@nuxt/ui-pro"],
  nitro: {
    experimental: {
      websocket: true,
    },
  },
});
