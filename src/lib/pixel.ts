/**
 * Meta Pixel opcional. Defina META_PIXEL_ID no Environment do servidor para ativar.
 * O evento "Contact" do envio ao WhatsApp é disparado em `tracking.ts`.
 */
export function initMetaPixel(pixelId: string | undefined): void {
  if (!pixelId || typeof window === "undefined" || window.fbq) return;

  type Fbq = ((...args: unknown[]) => void) & { queue: unknown[][]; loaded: boolean; version: string; push: Fbq; callMethod?: (...args: unknown[]) => void };

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  (window as Window & { _fbq?: Fbq })._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", pixelId);
  fbq("track", "PageView");
}
