import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { baseUrl } from "@/config/index";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
    proxy: {
      "/xkx": {
        // target: "http://123.57.91.8:1124/",
        target: "http://localhost:1188/",
        changeOrigin: true,
        rewrite: (path) => {
          return path.replace(/\/xkx/, "");
        },
      },
    },
  },
});
