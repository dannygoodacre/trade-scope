import { DeleteResult } from 'kysely';
import { jsonArrayFrom } from 'kysely/helpers/sqlite';

import type { NewTrade, QueryBuilder } from '@/database';
import { database } from '@/database';
import { Trade, TradeWithExecutions } from '@trade-tracker/shared/types.ts';

export const addTrade = (trade: NewTrade, db: QueryBuilder = database): Promise<Trade> =>
  db.insertInto('trades')
    .values(trade)
    .returningAll()
    .executeTakeFirstOrThrow();

export const deleteTrade = (id: number, db: QueryBuilder = database): Promise<DeleteResult> =>
  db.deleteFrom('trades')
    .where('id', '=', id)
    .executeTakeFirstOrThrow();

export const getTradeCount = (db: QueryBuilder = database): Promise<number> =>
  db.selectFrom('trades')
    .select((x) => x.fn.countAll<number>().as('count'))
    .executeTakeFirstOrThrow()
    .then(x => x.count);

export const getTrades = (page: number, limit: number, db: QueryBuilder = database): Promise<TradeWithExecutions[]> =>
  db.selectFrom('trades')
    .selectAll('trades')
    .orderBy('date', 'desc')
    .limit(limit)
    .offset((page - 1) * limit)
    .select(x => [
      jsonArrayFrom(
        x.selectFrom('executions')
          .select(['id', 'filled', 'order', 'price', 'side', 'madeAt'])
          .whereRef('executions.tradeId', '=', 'trades.id')
          .orderBy('executions.madeAt', 'asc'),
      ).as('executions'),
    ])
    .execute();

export const tradeExists = (id: number, db: QueryBuilder = database): Promise<boolean> =>
  db.selectFrom('trades')
    .select('id')
    .where('id', '=', id)
    .executeTakeFirst()
    .then(x => !!x);
