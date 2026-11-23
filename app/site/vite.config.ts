import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

const monorepoRoot = path.resolve(import.meta.dirname, "../..");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, monorepoRoot, "");

  return {
    plugins: [react(), tsconfigPaths()],
    envDir: monorepoRoot,
    resolve: {
      alias: {
        "@shared/api": path.resolve(monorepoRoot, "shared/api/src/index.ts"),
        "@shared/api-types": path.resolve(monorepoRoot, "shared/api-types/index.ts"),
      },
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_API_URL && env.VITE_API_URL.startsWith("http") ? env.VITE_API_URL : "http://localhost:8090",
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api/, ""),
        },
      },
    },
  };
});
