import multer, { FileFilterCallback } from "multer";
import type { Request } from "express";
import path from "path";
import { InvalidDocumentTypeError, InvalidImageTypeError } from "../errors/ImageErrors.js";
import { SupportedLang } from "../locales/index.js";

const memoryStorage = multer.memoryStorage();


function getLangOrFallback(req: Request): SupportedLang {
  return (req as any).language as SupportedLang ?? "al";
}
const createFileFilter =
  (allowed: RegExp, errorFactory: (lang: SupportedLang) => Error) =>
  (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    const lang = getLangOrFallback(req);

    if (extOk && mimeOk) {
      cb(null, true);
    } else {
      cb(errorFactory(lang));
    }
  };

const imageFilter = createFileFilter(
  /jpeg|jpg|png|webp|gif|avif/,
  (lang) => new InvalidImageTypeError(lang)
);

const documentFilter = createFileFilter(
  /pdf|doc|docx/,
  (lang) => new InvalidDocumentTypeError(lang)
);

/**
 * Multer factory
 */
const createUploader = (filter: typeof imageFilter, sizeMB: number) =>
  multer({
    storage: memoryStorage,
    fileFilter: filter,
    limits: { fileSize: sizeMB * 1024 * 1024 },
  });

// Define uploaders once
const imageUploader = createUploader(imageFilter, 5);
const documentUploader = createUploader(documentFilter, 10);

// Exports
export const uploadSingleProfileImage = imageUploader.single("image");
export const uploadSingleProfileImageAlt = imageUploader.single("profileImage");
export const uploadMultipleProfileImages = imageUploader.array("images", 5);

export const uploadSingleAgencyLogo = imageUploader.single("agencyLogo");
export const uploadMultipleAgencyLogos = imageUploader.array("agencyLogos", 3);

export const uploadSingleGeneralImage = imageUploader.single("image");
export const uploadMultipleGeneralImages = imageUploader.array("images", 5);

export const uploadSingleProductImage = imageUploader.single("image");
export const uploadMultipleProductImages = imageUploader.array("images", 10);

export const uploadSingleDocument = documentUploader.single("document");
export const uploadMultipleDocuments = documentUploader.array("documents", 5);
