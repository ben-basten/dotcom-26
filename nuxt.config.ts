import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/fonts", "@nuxt/eslint"],
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
  compatibilityDate: "2025-07-15",
});
