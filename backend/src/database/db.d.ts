import type { ColumnType } from 'kysely';

type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>;

interface Trades {
  id: Generated<number>;
  date: string;
  float: number;
  news: string | null;
  newsTime: string | null;
  sector: string;
  symbol: string;
  volume: number;
}

interface Executions {
  id: Generated<number>;
  filled: number;
  madeAt: string;
  order: number;
  price: string;
  side: number;
  tradeId: number;
}

export interface DB {
  trades: Trades;
  executions: Executions;
}
