export class AppError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request') {
    super(message, 400);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation error', public details?: unknown) {
    super(message, 400);
  }
}

export class InvalidFileTypeError extends BadRequestError {
  constructor(message: string = 'Only image files are allowed') {
    super(message);
  }
}

export class FileTooLargeError extends BadRequestError {
  constructor(message: string = 'File too large. Maximum 5MB allowed.') {
    super(message);
  }
}
