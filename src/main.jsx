import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { getTheme, THEMES } from "./utils/themes.js";
import "./index.css";

// Appliquer le thème au démarrage
const theme = THEMES[getTheme()] || THEMES.default;
document.body.style.background = theme.background;
document.documentElement.style.setProperty("--accent", theme.accent);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);