import SQLite from 'better-sqlite3';
import { Insertable, Kysely, ParseJSONResultsPlugin, Selectable, SqliteDialect, Transaction } from 'kysely';

import config from '@/config';
import { DB, Trades, Executions } from './db';

export const database = new Kysely<DB>({
  dialect: new SqliteDialect({
    database: new SQLite(config.databaseConnectionString),
  }),
  plugins: [new ParseJSONResultsPlugin()],
});

export type NewExecution = Insertable<Executions>;

export type ExecutionRow = Selectable<Executions>;

export type NewTrade = Insertable<Trades>;

export type TradeRow = Selectable<Trades>;

export type QueryBuilder = Kysely<DB> | Transaction<DB>;
