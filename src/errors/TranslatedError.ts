import { BaseError } from "./BaseError.js";
import { t } from "../utils/i18n.js";
import { SupportedLang } from "../locales/index.js";

export class TranslatedError extends BaseError {
  constructor(
    key: keyof typeof import("../locales/index.js").translations.en, // translation key
    lang: SupportedLang,
    statusCode = 400
  ) {
    super(t(key, lang), statusCode);
  }
}