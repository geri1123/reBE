import { translations, SupportedLang } from "../locales/index.js";

let currentLang: SupportedLang = "al";

export function setLang(lang: SupportedLang) {
  currentLang = lang;
}

export function t(key: keyof typeof translations.en, lang?: SupportedLang) {
  return translations[lang ?? currentLang][key];
}