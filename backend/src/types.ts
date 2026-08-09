import { Request } from 'express';
import { z } from 'zod';

import {
  CreateTradeRequestSchema,
  CreateTradeSchema,
  DeleteTradeRequestSchema,
  GetTradeRequestSchema
} from '@/schemata/trade.schema';

export type TypedRequest<T extends { body?: any; query?: any; params?: any }> = Request<
  T['params'],
  any,
  T['body'],
  T['query']
>;

export type CreateTradeInput = z.infer<typeof CreateTradeSchema>;

export type CreateTradeRequest = z.infer<typeof CreateTradeRequestSchema>;

export type GetTradeRequest = z.infer<typeof GetTradeRequestSchema>;

export type DeleteTradeRequest = z.infer<typeof DeleteTradeRequestSchema>;
