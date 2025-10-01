// import { en } from "./en.js";
// import {it} from "./it.js"
// import { al } from "./al.js";

// export const translations = { en, it, al } as const;

// export type SupportedLang = keyof typeof translations;

import { en } from "./en.js";
import { it } from "./it.js";
import { al } from "./al.js";

export const translations = { en, it, al } as const;
export type SupportedLang = keyof typeof translations;

// Translate function: always require a language
export function t(key: keyof typeof translations.en, lang: SupportedLang) {
  return translations[lang][key];
}