// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "nuxt-auth-utils",
    "@nuxtjs/google-fonts",
  ],
  googleFonts: {
    families: {
      Roboto: true,
      Inter: [400, 700],
    },
  },
  app: {
    cdnURL: "https://lachlannuxttest.s3.ap-southeast-2.amazonaws.com/",
    head: {
      title: "StudyHQ",
    },
  },
});
