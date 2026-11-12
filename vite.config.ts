import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  // URL pública (ex.: https://simulador.seudominio.com.br) — usada nas meta tags de compartilhamento.
  const siteUrl = (env.VITE_SITE_URL ?? "").replace(/\/$/, "");

  return {
    server: {
      host: "::",
      port: 8080,
      // Em desenvolvimento, a API do rodízio roda em `npm run dev:api` (porta 3000).
      proxy: { "/api": "http://localhost:3000" },
    },
    plugins: [
      react(),
      {
        name: "inject-site-url",
        transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", siteUrl),
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
