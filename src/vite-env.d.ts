/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL pública do simulador (meta tags de compartilhamento). */
  readonly VITE_SITE_URL?: string;
  /** API do rodízio em outro domínio. Vazio = mesma origem (/api), que é o padrão no Docker. */
  readonly VITE_API_URL?: string;
  /** ID do Meta Pixel (opcional). */
  readonly VITE_META_PIXEL_ID?: string;
}

/** Scripts de terceiros que podem existir na página (Meta Pixel, Google Analytics/GTM). */
interface Window {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  opera?: string;
}
