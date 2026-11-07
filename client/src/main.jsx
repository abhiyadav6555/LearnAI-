
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./styles/global.css";
import "./styles/theme.css";
import "./styles/premium-pages.css";

import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
