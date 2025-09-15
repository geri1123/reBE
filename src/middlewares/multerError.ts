import { Request, Response, NextFunction } from "express";
import { ImageTooLargeError, TooManyImagesError } from "../errors/ImageErrors.js";

export function multerErrorWrapper(multerMiddleware: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    multerMiddleware(req, res, (err: any) => {
      if (!err) return next();

      // Multer built-in errors
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new ImageTooLargeError((req as any).language || "al"));
      }

      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return next(new TooManyImagesError((req as any).language || "al"));
      }

     
      next(err);
    });
  };
}