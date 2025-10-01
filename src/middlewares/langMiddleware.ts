import { NextFunction, Request, Response } from "express";
import { translations, SupportedLang } from "../locales/index.js";

export function detectLanguage(req: Request, res: Response, next: NextFunction) {
  const supported = Object.keys(translations) as SupportedLang[];

  const lang = supported.includes(req.query.lang as SupportedLang)
    ? (req.query.lang as SupportedLang)
    : "al"; // fallback

  res.locals.lang = lang;          
  (req as any).language = lang;    
  next();
}

//  import { NextFunction, Request, Response } from "express";
// import { setLang } from "../utils/i18n.js";
// import { SupportedLang } from "../locales/index.js";
// export function detectLanguage(req: Request, res: Response, next: NextFunction) {
//   const lang = ["en", "it"].includes(req.query.lang as string)
//     ? (req.query.lang as SupportedLang)
//     : "al";

//   setLang(lang);
//   res.locals.lang = lang;
//   (req as any).language = lang; 
//   next();
// }