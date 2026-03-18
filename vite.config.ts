import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const rootDir = __dirname;
const reactPath = path.resolve(rootDir, "node_modules/react");
const reactDomPath = path.resolve(rootDir, "node_modules/react-dom");

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
      react: reactPath,
      "react-dom": reactDomPath,
      "react/jsx-runtime": path.resolve(reactPath, "jsx-runtime.js"),
      "react/jsx-dev-runtime": path.resolve(reactPath, "jsx-dev-runtime.js"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    preserveSymlinks: false,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
