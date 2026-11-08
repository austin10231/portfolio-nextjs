"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import translations from "@/data/translations.json";

export type Language = "en" | "zh";
type Preferences = {
  language: Language;
  dark: boolean;
  toggleLanguage: () => void;
  toggleTheme: () => void;
};
const Context = createContext<Preferences | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      setLanguage(localStorage.getItem("lang") === "zh" ? "zh" : "en");
      setDark(localStorage.getItem("portfolio-theme") === "dark");
    } catch { /* Preferences still work when browser storage is unavailable. */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.body.classList.toggle("dark", dark);
    document.body.classList.toggle("light", !dark);
  }, [language, dark]);

  const persist = (key: string, value: string) => {
    try { localStorage.setItem(key, value); } catch { /* Session-only preference. */ }
  };

  return <Context.Provider value={{
    language, dark,
    toggleLanguage: () => {
      const next = language === "en" ? "zh" : "en";
      persist("lang", next);
      setLanguage(next);
    },
    toggleTheme: () => {
      persist("portfolio-theme", dark ? "light" : "dark");
      setDark(!dark);
    },
  }}>{children}</Context.Provider>;
}

export function usePreferences() {
  const value = useContext(Context);
  if (!value) throw new Error("PreferencesProvider is required");
  return value;
}

export function useTranslation() {
  const { language } = usePreferences();
  const dictionary: Record<string, string> = translations[language];
  return (id: string, fallback = id) => dictionary[id] ?? fallback;
}

export function Text({ id }: { id: string }) {
  const t = useTranslation();
  return <>{t(id)}</>;
}

export function ResumeLink() {
  const { language } = usePreferences();
  const path = language === "zh" ? "何沐天 AI Resume CN.pdf" : "Mutian He AI Resume.pdf";
  return <a id="resume-link" href={`/${encodeURI(path)}`} target="_blank" rel="noreferrer">
    <span className="btn btn--outline"><Text id="btn_resume" /></span>
  </a>;
}
