import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "localhost",
    port: 8080,
    allowedHosts: ["localhost"],
    client: {
      webSocketURL: "wss://localhost/ws",
    },
    proxy: {
      "/api": {
        target: "http://localhost:3016",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  base: "/", // для правильных путей на домене centavra.xyz
});