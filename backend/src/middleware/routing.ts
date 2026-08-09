import { ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: ZodType) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validatedRequest = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as any;

      if (validatedRequest.body) {
        req.body = validatedRequest.body;
      }

      if (validatedRequest.params) {
        Object.assign(req.params, validatedRequest.params);
      }

      if (validatedRequest.query) {
        Object.assign(req.query, validatedRequest.query);
      }

      return next();
    } catch (error) {
      next(error);
    }
  };

export const methodsAllowed = (...allowed: string[]) =>
  (req: Request, res: Response) => {
    res.setHeader('Allow', allowed.join(',').toUpperCase());

    return res.status(405).json({
      status: 405,
      message: 'Method Not Allowed',
      path: req.originalUrl,
      allowed: allowed.map(x => x.toUpperCase()),
    });
  };
