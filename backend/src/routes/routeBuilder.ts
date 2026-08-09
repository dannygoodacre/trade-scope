import { Router } from 'express';
import { type ZodType } from 'zod';

import { methodsAllowed, validate } from '@/middleware/routing';

type EndpointConfig = [method: 'get' | 'post' | 'put' | 'delete' | 'patch', schema: ZodType, handler: any];

export function buildRoutes(routes: Record<string, EndpointConfig[]>): Router {
  const router = Router();

  for (const [path, configs] of Object.entries(routes)) {
    const allowedMethods: string[] = [];

    for (const config of configs) {
      const [method, schema, handler] = config;

      allowedMethods.push(method.toUpperCase());

      router[method](path, validate(schema), handler);
    }

    router.all(path, methodsAllowed(...allowedMethods));
  }

  return router;
}
