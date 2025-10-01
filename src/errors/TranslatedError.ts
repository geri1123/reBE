import { BaseError } from "./BaseError.js";

import { SupportedLang,t } from "../locales/index.js";

export class TranslatedError extends BaseError {
  constructor(
    key: keyof typeof import("../locales/index.js").translations.en, 
    lang: SupportedLang,
    statusCode = 400
  ) {
    super(t(key, lang), statusCode);
  }
}