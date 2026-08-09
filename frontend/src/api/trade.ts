import { get, post } from './client.ts';

import type { ExecutionData, PaginatedTradesResponse, TradeData } from '@trade-tracker/shared/types';

export const addTrade = (trade: TradeData, executionsData: ExecutionData[]): Promise<void> =>
  post<void>('/api/trades', {
    date: trade.date,
    float: trade.float,
    ...(trade.news !== '' && { news: trade.news }),
    ...(trade.newsTime !== '' && { newsTime: trade.newsTime }),
    sector: trade.sector,
    symbol: trade.symbol,
    volume: trade.volume,
    executions: executionsData.map(x => ({
      filled: x.filled,
      madeAt: x.madeAt,
      order: x.order,
      price: x.price,
      side: x.side
    }))
  });

export const getPaginatedTrades = (page: number, count: number): Promise<PaginatedTradesResponse> =>
  get<PaginatedTradesResponse>(`/api/trades?page=${page}&limit=${count}`);
