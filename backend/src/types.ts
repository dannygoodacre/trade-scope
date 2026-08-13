import { Request } from 'express';
import { z } from 'zod';

import {
  CreateTradeRequestSchema,
  CreateTradeSchema,
  DeleteTradeRequestSchema,
  GetTradeRequestSchema,
} from '@/schemas/trade.schema';

export type TypedRequest<
  T extends {
    body?: unknown;
    query?: unknown;
    params?: unknown;
  },
> = Request<
  T['params'] extends Record<string, unknown> ? T['params'] : Record<string, string>,
  unknown,
  T['body'],
  T['query'] extends Record<string, unknown> ? T['query'] : Record<string, unknown>
>;

export type CreateTradeRequest = z.infer<typeof CreateTradeRequestSchema>;

export type CreateTradeInput = z.infer<typeof CreateTradeSchema>;

export type DeleteTradeRequest = z.infer<typeof DeleteTradeRequestSchema>;

export type GetTradeRequest = z.infer<typeof GetTradeRequestSchema>;
