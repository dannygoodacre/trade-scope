import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

interface RequestValidationShape {
  body?: unknown;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
}

export const validate =
  <T extends RequestValidationShape>(schema: ZodType<T>) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (validated.body !== undefined) {
        req.body = validated.body;
      }

      if (validated.params) {
        Object.assign(req.params, validated.params);
      }

      if (validated.query) {
        Object.assign(req.query, validated.query);
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };

export const methodsAllowed =
  (...allowed: string[]) =>
  (req: Request, res: Response) => {
    res.setHeader('Allow', allowed.join(',').toUpperCase());

    return res.status(405).json({
      status: 405,
      message: 'Method Not Allowed',
      path: req.originalUrl,
      allowed: allowed.map((x) => x.toUpperCase()),
    });
  };
