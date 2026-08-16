import { z } from 'zod';

import { GetProfitLossRequestSchema } from '@/controllers/analytics.schema';

export type GetProfitLossRequest = z.infer<typeof GetProfitLossRequestSchema>;

export interface Foo {
  date: string;
  netProfit: number;
}
