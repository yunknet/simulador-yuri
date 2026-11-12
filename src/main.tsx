import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initMetaPixel } from "./lib/pixel";
import { initUTMTracking, trackPageView } from "./lib/tracking";
import "./index.css";

initUTMTracking();
trackPageView();
initMetaPixel(import.meta.env.VITE_META_PIXEL_ID);

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
