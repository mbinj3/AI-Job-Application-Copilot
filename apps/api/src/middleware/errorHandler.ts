import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { HTTP_STATUS } from '@copilot/shared';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { AppError } from '../utils/errors.js';

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
    stack?: string;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export function errorHandler(
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const timestamp = new Date().toISOString();
  const requestId = (req.id || req.headers['x-request-id']) as string | undefined;

  // 1. Handled custom AppError
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error(
        { err, requestId, url: req.originalUrl, method: req.method },
        `Non-operational AppError: ${err.message}`
      );
    } else {
      logger.warn(
        { code: err.code, statusCode: err.statusCode, requestId, url: req.originalUrl },
        `Handled AppError: ${err.message}`
      );
    }

    const payload: ErrorResponse = {
      success: false,
      error: {
        message: err.message,
        code: err.code,
        ...(err.details !== undefined && { details: err.details }),
        ...(env.isDevelopment && { stack: err.stack }),
      },
      meta: {
        timestamp,
        ...(requestId && { requestId }),
      },
    };

    res.status(err.statusCode).json(payload);
    return;
  }

  // 2. Handled Zod validation error
  if (err instanceof ZodError) {
    const formattedDetails = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    logger.warn(
      { details: formattedDetails, requestId, url: req.originalUrl },
      'Request validation failed'
    );

    const payload: ErrorResponse = {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: formattedDetails,
      },
      meta: {
        timestamp,
        ...(requestId && { requestId }),
      },
    };

    res.status(HTTP_STATUS.BAD_REQUEST).json(payload);
    return;
  }

  // 3. Body parser syntax error (malformed JSON)
  if (err instanceof SyntaxError && 'status' in err && (err as { status: number }).status === 400) {
    logger.warn({ requestId, url: req.originalUrl }, 'Malformed JSON body in request');

    const payload: ErrorResponse = {
      success: false,
      error: {
        message: 'Malformed JSON payload in request body',
        code: 'INVALID_JSON_BODY',
      },
      meta: {
        timestamp,
        ...(requestId && { requestId }),
      },
    };

    res.status(HTTP_STATUS.BAD_REQUEST).json(payload);
    return;
  }

  // 4. Unexpected / unknown internal error
  logger.error(
    { err, requestId, url: req.originalUrl, method: req.method },
    `Unhandled error: ${err.message}`
  );

  const payload: ErrorResponse = {
    success: false,
    error: {
      message: env.isProduction ? 'Internal server error' : err.message || 'Something went wrong',
      code: 'INTERNAL_SERVER_ERROR',
      ...(env.isDevelopment && { stack: err.stack }),
    },
    meta: {
      timestamp,
      ...(requestId && { requestId }),
    },
  };

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(payload);
}

