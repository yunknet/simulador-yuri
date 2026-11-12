/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API do rodízio em outro domínio. Vazio = mesma origem (/api), que é o padrão no Docker. */
  readonly VITE_API_URL?: string;
}

interface Window {
  /** Configuração injetada pelo servidor a partir do Environment (ver server/index.js). */
  __APP_CONFIG__?: { metaPixelId?: string };
  /** Scripts de terceiros que podem existir na página (Meta Pixel, Google Analytics/GTM). */
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  opera?: string;
}
