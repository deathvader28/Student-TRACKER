// src/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // global styles (Vite creates this by default)

// ---------------------------------------------------------------------------
// Find the #root div in index.html and mount the React app inside it
// ---------------------------------------------------------------------------
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* App contains BrowserRouter, AuthProvider, and all routes */}
    <App />
  </StrictMode>
);