import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initUTMTracking, trackPageView } from "./lib/tracking";
import "./index.css";

initUTMTracking();
trackPageView();

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
