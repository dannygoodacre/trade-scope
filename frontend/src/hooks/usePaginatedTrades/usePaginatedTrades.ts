import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getPaginatedTrades } from '@/api/trade';

import type { PaginatedTradesResponse } from '@trade-scope/shared/types';

export default function usePaginatedTrades(page: number, limit: number) {
  return useQuery<PaginatedTradesResponse>({
    queryFn: () => getPaginatedTrades(page, limit),

    queryKey: ['trades', { page, count: limit }],

    placeholderData: keepPreviousData,
  });
}
