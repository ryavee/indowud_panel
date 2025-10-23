import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SettingsProvider } from "./Context/SettingsContext";
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById("root")).render(
  <SettingsProvider>
    <App />
    <Toaster position="top-right" reverseOrder={false} />
  </SettingsProvider>
);
