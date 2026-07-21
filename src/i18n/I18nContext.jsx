import { createContext, useContext, useMemo, useState, useEffect } from "react";
import fr from "./locales/fr.json";
import en from "./locales/en.json";

const DICTS = { fr, en };
const I18nContext = createContext(null);

function getFromPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("tkr_lang") || "fr");

  useEffect(() => {
    localStorage.setItem("tkr_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => {
    return (path) => getFromPath(DICTS[lang], path) ?? getFromPath(DICTS.fr, path) ?? path;
  }, [lang]);

  // Pick the right language field on a bilingual document, e.g. field("title") -> title_fr / title_en
  const field = useMemo(() => {
    return (doc, base) => {
      if (!doc) return "";
      const key = `${base}_${lang}`;
      const fallbackKey = `${base}_fr`;
      return doc[key] ?? doc[fallbackKey] ?? doc[base] ?? "";
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t, field }), [lang, t, field]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
