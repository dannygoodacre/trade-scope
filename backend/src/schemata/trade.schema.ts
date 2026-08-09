import { Side } from '@trade-scope/shared/enums';
import { TradeDataShape } from '@trade-scope/shared/schemata/trade.schema';
import { ExecutionData } from '@trade-scope/shared/types';
import { z } from 'zod';

import { CreateExecutionRequestSchema } from '@/schemata/execution.schema';
import { CreateTradeInput } from '@/types';

export const CreateTradeSchema = TradeDataShape.extend({
  executions: z.array(CreateExecutionRequestSchema).min(2)
})
  .transform(body => ({
    ...body,
    date: new Date(body.date).toISOString()
  }))
  .superRefine((body, ctx) => {
    if (new Date(body.date) > new Date()) {
      ctx.addIssue({
        code: 'custom',
        message: "'date' cannot be in the future",
        path: ['date']
      });
    }

    if (!newsFieldsAreSynced(body)) {
      ctx.addIssue({
        code: 'custom',
        message: "Both 'news' and 'newsTime' must either be provided or omitted",
        path: ['news']
      });
    }

    const hasRequiredSides = hasBuyAndSell(body.executions);

    if (!hasRequiredSides) {
      ctx.addIssue({
        code: 'custom',
        message: 'Must have at least one BUY and at least one SELL execution',
        path: ['executions']
      });
    }

    if (hasRequiredSides && !tradeIsClosed(body.executions)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Trade must be fully closed (net shares must be zero)',
        path: ['executions']
      });
    }
  });

export const CreateTradeRequestSchema = z.strictObject({
  body: CreateTradeSchema,
  query: z.any(),
  params: z.any()
});

export const GetTradeRequestSchema = z.strictObject({
  body: z.any(),
  query: z.strictObject({
    page: z.string().regex(/^\d+$/),
    limit: z.string().regex(/^\d+$/)
  }),
  params: z.any()
});

export const DeleteTradeRequestSchema = z.strictObject({
  body: z.any(),
  query: z.any(),
  params: z.strictObject({
    id: z.string().regex(/^\d+$/)
  })
});

function newsFieldsAreSynced(request: Omit<CreateTradeInput, 'executions'>): boolean {
  return !!request.news === !!request.newsTime;
}

function hasBuyAndSell(executions: ExecutionData[]): boolean {
  const sides = new Set(executions.map(x => x.side));

  return sides.has(Side.Buy) && sides.has(Side.Sell);
}

function tradeIsClosed(executions: ExecutionData[]): boolean {
  const netPosition = executions.reduce((sum, ex) => sum + (ex.side === Side.Buy ? ex.filled : -ex.filled), 0);

  return netPosition === 0;
}
