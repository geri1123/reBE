export class BaseError extends Error {
  public statusCode: number;
  public errors?: Record<string, string>;

  constructor(message: string, statusCode = 400, errors?: Record<string, string>) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends BaseError {
  constructor(errors: Record<string, string>) {
    super("Validation failed", 400, errors);
  }
}
export class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized", errors?: Record<string, string>) {
    super(message, 401, errors);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}
export class NotFoundError extends BaseError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

 export class FileSystemError extends BaseError {
  constructor(message: string) {
    super(message, 500);
  }
}
export class TooManyRequestsError extends BaseError {
  constructor(message = "Too many requests") {
    super(message, 429);
  }
}

