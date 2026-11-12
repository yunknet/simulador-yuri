import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initMetaPixel } from "./lib/pixel";
import { initUTMTracking, trackPageView } from "./lib/tracking";
import "./index.css";

initUTMTracking();
trackPageView();
initMetaPixel(window.__APP_CONFIG__?.metaPixelId);

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
