import { BaseError } from "./BaseError.js";
import { SupportedLang } from "../locales/index.js";
import { t } from "../utils/i18n.js";

export class InvalidDocumentTypeError extends BaseError {
  constructor(lang: SupportedLang) {
    super(t("invalidDocumentType", lang), 400);
  }
}

export class DocumentTooLargeError extends BaseError {
  constructor(lang: SupportedLang) {
    super(t("documentTooLarge", lang), 413);
  }
}

export class TooManyDocumentsError extends BaseError {
  constructor(lang: SupportedLang) {
    super(t("tooManyDocuments", lang), 400);
  }
}