import { Router } from 'express';

import { methodsAllowed, validate } from '@/middleware/routing';

type ValidationSchema = Parameters<typeof validate>[0];

type EndpointConfig = [
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  schema: ValidationSchema,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (...args: any[]) => any,
];

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
