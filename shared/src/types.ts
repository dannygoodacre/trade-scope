import { z } from 'zod';

import { ExecutionDataShape, ExecutionShape, TradeDataShape, TradeShape, TradeWithExecutionsShape } from '@trade-tracker/shared/schemata';

export type ExecutionData = z.infer<typeof ExecutionDataShape>;

export type Execution = z.infer<typeof ExecutionShape>;

export type TradeData = z.infer<typeof TradeDataShape>;

// TODO: Is this only needed by the frontend?
export type Trade = z.infer<typeof TradeShape>;

export type TradeWithExecutions = z.infer<typeof TradeWithExecutionsShape>;

export interface PaginatedTradesResponse {
  trades: TradeWithExecutions[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
