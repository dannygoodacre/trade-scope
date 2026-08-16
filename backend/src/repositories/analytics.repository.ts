import { sql } from 'kysely';

import { database, QueryBuilder } from '@/database';

import type { Foo } from '@/controllers/analytics.types';

export const getTrades = (from: string, to: string, symbol?: string, db: QueryBuilder = database): Promise<Foo[]> =>
  db
    .selectFrom('trades')
    .select([
      'date',
      sql<number>`(
        SELECT COALESCE(SUM(CASE WHEN side = 1 THEN price * volume ELSE -(price * volume) END), 0)
        FROM executions
        WHERE executions.tradeId = trades.id
      )`.as('netProfit'),
    ])
    .$if(!!symbol, (x) => x.where('symbol', '=', symbol!))
    .where('date', '>=', from)
    .where('date', '<=', to)
    .orderBy('date', 'asc')
    .execute();
