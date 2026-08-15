import { ExecutionDataShape, ExecutionShape } from '@trade-scope/shared/schemas/execution.schema';
import { z } from 'zod';

export const TradeDataShape = z.strictObject({
  date: z.iso.date(),
  float: z.coerce.number().int().positive(),
  news: z.string().nullish(),
  newsTime: z.iso.datetime().nullish(),
  sector: z.string().min(1),
  symbol: z.string().min(1).toUpperCase(),
  volume: z.coerce.number().int().positive(),
});

export const TradeShape = TradeDataShape.extend({
  id: z.number().int().positive(),
});

export const TradeWithExecutionsShape = TradeShape.extend({
  executions: z.array(ExecutionShape).min(2),
});

export const NewTradeShape = TradeDataShape.extend({
  executions: z.array(ExecutionDataShape).min(2),
});
