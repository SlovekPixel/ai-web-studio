import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");
const frontendPort = Number(process.env.FRONTEND_PORT) || 5173;
const apiProxyTarget =
  process.env.VITE_API_PROXY_TARGET ||
  `http://localhost:${process.env.BACKEND_PORT || 3000}`;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: rootDir,
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: frontendPort,
    strictPort: true,
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: frontendPort,
    strictPort: true,
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
