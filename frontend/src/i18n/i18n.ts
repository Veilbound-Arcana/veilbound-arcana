import en from "./en.json";
import id from "./id.json";
import { useGameStore } from "@/store/useGameStore";

const dictionaries: Record<string, Record<string, any>> = {
  en,
  id,
};

export function t(key: string, params?: Record<string, string | number> | string): string {
  const lang = useGameStore.getState().save.settings.language || "en";
  const dict = dictionaries[lang] || en;
  const parts = key.split(".");
  let current: any = dict;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      current = undefined;
      break;
    }
  }

  if (typeof current !== "string") {
    // Fallback to English
    let fallback: any = en;
    for (const part of parts) {
      if (fallback && typeof fallback === "object" && part in fallback) {
        fallback = fallback[part];
      } else {
        fallback = typeof params === "string" ? params : key;
        break;
      }
    }
    current = typeof fallback === "string" ? fallback : (typeof params === "string" ? params : key);
  }

  if (params && typeof params === "object" && typeof current === "string") {
    return current.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
  }

  return current || (typeof params === "string" ? params : key);
}

export function useI18n() {
  const language = useGameStore((s) => s.save.settings.language);
  return {
    t: (key: string, params?: Record<string, string | number>) => t(key, params),
    language,
    setLanguage: (lang: "en" | "id") => useGameStore.getState().setSetting("language", lang),
  };
}
