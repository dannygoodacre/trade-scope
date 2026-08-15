import { DeleteResult } from 'kysely';

import { database, NewExecution, QueryBuilder } from '@/database';

export const addExecutions = (executions: NewExecution[], db: QueryBuilder = database): Promise<{ id: number }[]> =>
  db.insertInto('executions').values(executions).returning('id').execute();

export const deleteExecutionsByTradeId = (tradeId: number, db: QueryBuilder = database): Promise<DeleteResult> =>
  db.deleteFrom('executions').where('tradeId', '=', tradeId).executeTakeFirstOrThrow();
