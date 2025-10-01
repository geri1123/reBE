// import { Request, Response, NextFunction } from 'express';
// import { BaseError } from '../errors/BaseError.js';

// export default function errorHandler(
//   err: Error,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Response | void {
//   if (err instanceof BaseError) {
//     return res.status(err.statusCode).json({
//       message: err.message,
//       ...(err.errors && { errors: err.errors }),
//     });
//   }

//   console.error(err);
//   res.status(500).json({ message: 'Internal server error' });
// }
import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../errors/BaseError.js';

import { SupportedLang,t } from '../locales/index.js';
export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
const language: SupportedLang = res.locals.lang;
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,              
      ...(err.errors && { errors: err.errors }),
    });
  }

  console.error(err);
  return res.status(500).json({  message: t("internalServerError", language)});
}