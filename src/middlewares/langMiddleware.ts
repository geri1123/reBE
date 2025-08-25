// // backend/src/middleware/langMiddleware.ts
// import { NextFunction, Request, Response } from "express";
// import { translations, SupportedLang } from "../locales/translations";



// export function detectLanguage(req: Request, res: Response, next: NextFunction) {
//   const langFromQuery = req.query.lang as string;
//   const lang: SupportedLang = ["en", "it"].includes(langFromQuery)
//     ? (langFromQuery as SupportedLang)
//     : "al"; 
//   res.locals.lang = lang;
//   next();
// }

// // helper to fetch translated text
// export function t(key: keyof typeof translations.en, lang: SupportedLang) {
//   return translations[lang][key];
// }


 import { NextFunction, Request, Response } from "express";
import { setLang } from "../utils/i18n";
import { SupportedLang } from "../locales/translations";
export function detectLanguage(req: Request, res: Response, next: NextFunction) {
  const lang = ["en", "it"].includes(req.query.lang as string)
    ? (req.query.lang as SupportedLang)
    : "al";

  setLang(lang);
  res.locals.lang = lang;
  next();
}