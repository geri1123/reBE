import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../errors/BaseError.js';

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
  }

  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
}