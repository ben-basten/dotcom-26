import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/fonts", "@nuxt/eslint", "@nuxt/content", "@nuxtjs/sitemap"],
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    typeCheck: true,
  },
  devtools: { enabled: true },
  site: {
    name: "Ben Basten",
    url: process.env.DEPLOY_PRIME_URL,
  },
  sitemap: {
    zeroRuntime: true,
  },
  compatibilityDate: "2026-06-21",
});
