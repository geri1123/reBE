import { Request, Response, NextFunction } from "express";
import { DocumentTooLargeError, TooManyDocumentsError } from "../errors/DocumentErrors.js";

export function multerDocumentErrorWrapper(multerMiddleware: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    multerMiddleware(req, res, (err: any) => {
      if (!err) return next();

      // Multer built-in errors
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new DocumentTooLargeError((req as any).language || "al"));
      }

      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return next(new TooManyDocumentsError((req as any).language || "al"));
      }

      next(err);
    });
  };
}
