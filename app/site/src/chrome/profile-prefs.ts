export type ThemeChoice = "light" | "dark" | "system";
export type LangChoice = "ru" | "en" | "es";

const THEME_KEY = "finder-theme";
const LANG_KEY = "finder-lang";

export function readTheme(): ThemeChoice {
  const stored = localStorage.getItem(THEME_KEY);

  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }

  return "system";
}

export function readLang(): LangChoice {
  const stored = localStorage.getItem(LANG_KEY);

  if (stored === "ru" || stored === "en" || stored === "es") {
    return stored;
  }

  return "ru";
}

export function resolvedTheme(choice: ThemeChoice): "light" | "dark" {
  if (choice === "light" || choice === "dark") {
    return choice;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(choice: ThemeChoice) {
  document.documentElement.dataset.theme = resolvedTheme(choice);
  localStorage.setItem(THEME_KEY, choice);
}

export function applyLang(lang: LangChoice) {
  document.documentElement.lang = lang;
  localStorage.setItem(LANG_KEY, lang);
}
