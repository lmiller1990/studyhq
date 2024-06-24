// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@pinia/nuxt", "nuxt-auth-utils"],
  // extends: ["@nuxt/ui-pro"],
  nitro: {
    experimental: {
      websocket: true,
    },
    preset: "aws-lambda",
  },
  app: {
    cdnURL: "https://lachlannuxttest.s3.ap-southeast-2.amazonaws.com/",
  },
});
