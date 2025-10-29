import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsxFactory: "createElement",
    jsxFragment: "Fragment"
  },
  root: ".", 
  build: {
    outDir: "dist" 
  }
});

