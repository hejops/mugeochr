import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/mugeochr/", // must match repo name!
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(
        __dirname, // @types/node
        "./src",
      ),
    },
  },
});
