import { z } from 'zod';

const interval = ['day', 'week', 'month'] as const;

export const GetProfitLossRequestSchema = z.strictObject({
  body: z.any(),
  query: z.strictObject({
    from: z.iso.date(),
    to: z.iso.date(),
    interval: z.enum(interval),
    symbol: z
      .string()
      .min(1)
      .nullish()
      .transform((x) => x || undefined),
  }),
  params: z.any(),
});

export const GetProfitLossResponseSchema = z.strictObject({
  totalPnl: z.number(),
  winRate: z.number().min(0).max(1),
  interval: z.enum(interval),
  data: z.array(
    z.strictObject({
      date: z.iso.datetime(),
      pnl: z.number(),
    }),
  ),
});
