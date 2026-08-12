import { TradeDataShape, TradeShape, TradeWithExecutionsShape } from '@trade-scope/shared/schemas/trade.schema';
import { ExecutionDataShape, ExecutionShape } from '@trade-tracker/shared/schemas/execution.schema';
import { z } from 'zod';

export type ExecutionData = z.infer<typeof ExecutionDataShape>;

export type Execution = z.infer<typeof ExecutionShape>;

export type TradeData = z.infer<typeof TradeDataShape>;

export type Trade = z.infer<typeof TradeShape>;

export type TradeWithExecutions = z.infer<typeof TradeWithExecutionsShape>;

export interface PaginatedTradesResponse {
  trades: TradeWithExecutions[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
