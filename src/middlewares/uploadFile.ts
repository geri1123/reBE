import multer, { FileFilterCallback, StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import type { Request } from 'express';

const imageDir = './uploads/images';
const documentDir = './uploads/documents';
const profileImagesDir = './uploads/images/profile_images';
const agencyLogoDir = './uploads/images/agency_logo';
const generalImagesDir = './uploads/images/general';

// Create all directories if not exist
[imageDir, documentDir, profileImagesDir, agencyLogoDir, generalImagesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Generic image storage that can be configured for different folders
const createImageStorage = (subfolder: string): StorageEngine => multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, `${imageDir}/${subfolder}`);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

// Document storage (unchanged)
const documentStorage: StorageEngine = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, documentDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

// File filters
const imageFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  // Add 'webp' to allowed types
  const allowed = /jpeg|jpg|png|webp|gif|avif/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) cb(null, true);
  else cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
};
// const imageFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
//   const allowed = /jpeg|jpg|png/;
//   const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
//   const mimeOk = allowed.test(file.mimetype);
//   if (extOk && mimeOk) cb(null, true);
//   else cb(new Error('Only image files (jpeg, jpg, png) are allowed'));
// };

const documentFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const allowed = /pdf|doc|docx/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) cb(null, true);
  else cb(new Error('Only document files (pdf, doc, docx) are allowed'));
};

// Multer instances for different image types
const profileImageUpload = multer({
  storage: createImageStorage('profile_images'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const agencyLogoUpload = multer({
  storage: createImageStorage('agency_logo'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const generalImageUpload = multer({
  storage: createImageStorage('general'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const documentUpload = multer({
  storage: documentStorage,
  fileFilter: documentFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Export middleware for profile images
export const uploadSingleProfileImage = profileImageUpload.single('image'); 
export const uploadSingleProfileImageAlt = profileImageUpload.single('profileImage'); 
export const uploadMultipleProfileImages = profileImageUpload.array('images', 5);

// Export middleware for agency logos
export const uploadSingleAgencyLogo = agencyLogoUpload.single('agencyLogo');
export const uploadMultipleAgencyLogos = agencyLogoUpload.array('agencyLogos', 3);

// Export middleware for general images
export const uploadSingleGeneralImage = generalImageUpload.single('image');
export const uploadMultipleGeneralImages = generalImageUpload.array('images', 5);

// Export middleware for documents
export const uploadSingleDocument = documentUpload.single('document');
export const uploadMultipleDocuments = documentUpload.array('documents', 5);

// Optional: Dynamic uploader factory
export const createDynamicImageUploader = (type: 'profile_images' | 'agency_logo' | 'general') => {
  const upload = multer({
    storage: createImageStorage(type),
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  });

  return {
    single: (fieldName: string) => upload.single(fieldName),
    multiple: (fieldName: string, maxCount: number = 5) => upload.array(fieldName, maxCount),
  };
};

