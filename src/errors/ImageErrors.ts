import { BaseError } from "./BaseError.js";


import { SupportedLang } from "../locales/index.js";
import { t } from "../utils/i18n.js";

// 🔹 Invalid image type error
export class InvalidImageTypeError extends BaseError {
  constructor(lang: SupportedLang) {
    super(t("invalidImageType", lang), 400);
  }
}

// 🔹 Image too large error
export class ImageTooLargeError extends BaseError {
  constructor(lang: SupportedLang) {
    super(t("imageTooLarge", lang), 413); // 413 Payload Too Large
  }
}

// 🔹 Too many images uploaded
export class TooManyImagesError extends BaseError {
  constructor(lang: SupportedLang) {
    super(t("tooManyImages", lang), 400);
  }
}

// 🔹 No image uploaded
export class NoImageUploadedError extends BaseError {
  constructor(lang: SupportedLang) {
    super(t("noImageUploaded", lang), 400);
  }
}
export class InvalidDocumentTypeError extends BaseError {
  constructor(lang: SupportedLang) {
    super(t("invalidDocumentType", lang), 400);
  }
}