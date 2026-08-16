import { ExecutionDataShape, ExecutionShape } from '@trade-scope/shared/schemas/execution.schema';
import { z } from 'zod';

export const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must follow YYYY-MM-DD format')
  .refine((x) => {
    const [year, month, day] = x.split('-').map(Number);

    const date = new Date(Date.UTC(year, month - 1, day));

    return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month && date.getUTCDate() === day;
  }, 'Invalid calendar date');

export const TradeDataShape = z.strictObject({
  date: dateOnlySchema,
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
