// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsxFactory: "createElement",
    jsxFragment: "createFragment"
  },
  build: {
    outDir: "dist",
    target: "esnext"
  },
  server: {
    open: true,
    port: 5173
  }
});
