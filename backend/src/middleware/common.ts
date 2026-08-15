import { ValidationProblemDetails } from '@trade-tracker/shared/types';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { NotFoundError } from '@/error';

export function mapZodErrorToProblemDetails(
  err: ZodError,
  instanceUri?: string,
  traceId?: string,
): ValidationProblemDetails {
  const detail =
    err.issues.length === 1
      ? `Validation failed: ${err.issues[0].message}`
      : `${err.issues.length} validation errors occurred.`;

  return {
    type: 'about:blank',
    title: 'Bad Request',
    status: 400,
    detail: detail,
    instance: instanceUri,
    traceId: traceId,
    errors: err.issues.map((issue) => ({
      pointer: issue.path.length > 0 ? `/${issue.path.join('/')}` : '/',
      message: issue.message,
    })),
  };
}

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) =>
  next(new NotFoundError('Resource Not Found'));

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  void _next;

  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json(mapZodErrorToProblemDetails(err));
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      status: 404,
      message: err.message,
      path: req.originalUrl,
    });
  }

  return res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
  });
};
