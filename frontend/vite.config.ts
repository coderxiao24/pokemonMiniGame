import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/xkx": {
        target: "http://123.57.91.8:80/",
        changeOrigin: true,
        // rewrite: (path) => {
        //   return path.replace(/\/xkx/, "");
        // },
      },
    },
  },
});
