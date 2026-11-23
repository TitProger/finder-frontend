import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";
import { applyLang, applyTheme, readLang, readTheme } from "./chrome/profile-prefs";
import { queryClient } from "./query-client";
import "./site.css";

applyTheme(readTheme());
applyLang(readLang());

const root = document.getElementById("root");

if (!root) {
  throw new Error("Не найден корневой элемент");
}

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
