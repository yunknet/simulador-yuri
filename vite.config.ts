import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    // Em desenvolvimento, a API do rodízio roda em `npm run dev:api` (porta 3000).
    proxy: { "/api": "http://localhost:3000" },
  },
  plugins: [
    react(),
    {
      // Em produção quem preenche o domínio é o servidor (server/index.js).
      name: "dev-site-url",
      apply: "serve",
      transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", ""),
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
