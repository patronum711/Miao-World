// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://patronum711.github.io",
  base: "/Miao-World",
  integrations: [mdx(), react(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },
  legacy: {
    collectionsBackwardsCompat: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
