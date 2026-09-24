import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = document.getElementById("root");
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production HTML already contains the whole page for visitors and crawlers.
// Development keeps Vite's usual client rendering and hot reload behavior.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
