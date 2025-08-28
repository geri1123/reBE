

 import { NextFunction, Request, Response } from "express";
import { setLang } from "../utils/i18n";
import { SupportedLang } from "../locales/index.js";
export function detectLanguage(req: Request, res: Response, next: NextFunction) {
  const lang = ["en", "it"].includes(req.query.lang as string)
    ? (req.query.lang as SupportedLang)
    : "al";

  setLang(lang);
  res.locals.lang = lang;
  next();
}