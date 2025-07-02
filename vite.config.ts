import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  root: "./client",
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [
    react(),
    ...(mode === 'development' ? [
      (async () => {
        const { componentTagger } = await import("lovable-tagger");
        return componentTagger();
      })()
    ] : []),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
}));