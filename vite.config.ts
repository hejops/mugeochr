import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";

// without compression:
// 713.58 kB / 368.23 kB transferred
// Finish: 802 ms
// DOMContentLoaded: 242 ms
// load: 637 ms

// https://vite.dev/config/
export default defineConfig({
  base: "/mugeochr/", // must match repo name on prod! https://github.com/orgs/community/discussions/61478#discussioncomment-6513265
  plugins: [react(), tailwindcss(), compression()],
  resolve: {
    alias: {
      "@": path.resolve(
        __dirname, // @types/node
        "./src",
      ),
    },
  },
});
