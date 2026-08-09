import { useQuery } from '@tanstack/react-query';

import { getPaginatedTrades } from '@/api/trade';
import type { PaginatedTradesResponse } from '@trade-tracker/shared/types';

export default function usePaginatedTrades(page: number, limit: number) {
  return useQuery<PaginatedTradesResponse>({
    queryKey: ['trades', { page, count: limit }],
    queryFn: () => getPaginatedTrades(page, limit)
  });
}
