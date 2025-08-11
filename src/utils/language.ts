// src/utils/language.ts

import { LanguageCode } from "@prisma/client";

export function parseLanguageCode(lang?: string): LanguageCode {
  if (!lang) return LanguageCode.al;
  const lower = lang.toLowerCase();

  if (Object.values(LanguageCode).includes(lower as LanguageCode)) {
    return lower as LanguageCode;
  }
  return LanguageCode.al;
}