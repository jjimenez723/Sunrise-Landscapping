import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { seoHeadTags } from "./src/data/seo.js";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "site-seo",
      transformIndexHtml: () => seoHeadTags(),
    },
  ],
});
