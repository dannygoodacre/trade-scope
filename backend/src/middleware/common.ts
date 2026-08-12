import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { NotFoundError } from '@/error';

interface RFC9457ProblemDetails {
  type: string | 'about:blank';
  title: string;
  status: number;
  detail: string;
  instance?: string;
  errors?: Array<{
    pointer: string;
    message: string;
  }>;
}

export function mapZodErrorToProblemDetails(err: ZodError, instanceUri?: string): RFC9457ProblemDetails {
  const detail =
    err.issues.length === 1
      ? `Validation failed: ${err.issues[0].message}`
      : `${err.issues.length} validation errors occurred.`;

  //TODO: type: a URL providing some validation error information
  return {
    type: '',
    title: 'Validation Failed',
    status: 400,
    detail: detail,
    instance: instanceUri,
    errors: err.issues.map((issue) => ({
      pointer: issue.path.length > 0 ? `/${issue.path.join('/')}` : '/',
      message: issue.message,
    })),
  };
}
export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void =>
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
