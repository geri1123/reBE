import { ZodError } from "zod";
import { ValidationError } from "../errors/BaseError.js";

export function handleZodError(err: unknown, next: Function) {
  if (err instanceof ZodError) {
    const formattedErrors: Record<string, string> = {};

    for (const issue of err.issues) {
      const key = issue.path[0] as string;
      formattedErrors[key] = issue.message;
    }

    return next(new ValidationError(formattedErrors));
  }


  return next(err);
}