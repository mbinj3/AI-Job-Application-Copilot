import { HTTP_STATUS } from '@copilot/shared';

export interface AppErrorOptions {
  statusCode?: number;
  code?: string;
  details?: unknown;
  isOperational?: boolean;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = options.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
    this.code = options.code ?? 'INTERNAL_SERVER_ERROR';
    this.isOperational = options.isOperational ?? true;
    this.details = options.details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details?: unknown) {
    super(message, {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: 'BAD_REQUEST',
      details,
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details?: unknown) {
    super(message, {
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      code: 'UNAUTHORIZED',
      details,
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details?: unknown) {
    super(message, {
      statusCode: HTTP_STATUS.FORBIDDEN,
      code: 'FORBIDDEN',
      details,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource Not Found', details?: unknown) {
    super(message, {
      statusCode: HTTP_STATUS.NOT_FOUND,
      code: 'NOT_FOUND',
      details,
    });
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', details?: unknown) {
    super(message, {
      statusCode: 409,
      code: 'CONFLICT',
      details,
    });
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation Error', details?: unknown) {
    super(message, {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: 'VALIDATION_ERROR',
      details,
    });
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error', details?: unknown) {
    super(message, {
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      isOperational: false,
      details,
    });
  }
}

