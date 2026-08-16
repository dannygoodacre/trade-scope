import { get, post } from './client';

import type { NewTrade, PaginatedTradesResponse } from '@trade-scope/shared/types';

export const addTrade = (newTrade: NewTrade): Promise<void> =>
  post<void>('/api/trades', {
    date: newTrade.date,
    float: newTrade.float,
    ...(newTrade.news !== '' && { news: newTrade.news }),
    ...(newTrade.newsTime !== '' && { newsTime: newTrade.newsTime }),
    sector: newTrade.sector,
    symbol: newTrade.symbol,
    volume: newTrade.volume,
    executions: newTrade.executions.map((execution) => ({
      filled: execution.filled,
      madeAt: execution.madeAt,
      order: execution.order,
      price: execution.price,
      side: execution.side,
    })),
  });

export const getPaginatedTrades = (page: number, count: number): Promise<PaginatedTradesResponse> =>
  get<PaginatedTradesResponse>(`/api/trades?page=${page}&limit=${count}`);
