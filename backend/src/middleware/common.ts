import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { NotFoundError } from '@/error';
import { mapZodErrorToProblemDetails } from '@/middleware/test';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) =>
  next(new NotFoundError('Resource Not Found'));

export const globalErrorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json(mapZodErrorToProblemDetails(err));
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      status: 404,
      message: err.message,
      path: req.originalUrl
    });
  }

  return res.status(500).json({
    status: 500,
    message: 'Internal Server Error'
  });
};
