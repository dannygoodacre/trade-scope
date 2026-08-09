import { ExecutionData, PaginatedTradesResponse, TradeData } from '@trade-scope/shared/types';

import { database } from '@/database';
import { NotFoundError } from '@/error';
import * as executionRepo from '@/repositories/execution.repository';
import * as tradeRepo from '@/repositories/trade.repository';

/**
 * Create a new trade and its associated executions.
 *
 * @param tradeData The trade data
 * @param executionsData The data for each execution in the trade
 *
 * @return The ID of the new trade
 */
export async function createTrade(tradeData: TradeData, executionsData: ExecutionData[]): Promise<number> {
  return await database.transaction().execute(async trx => {
    const trade = await tradeRepo.addTrade(tradeData, trx);

    const executionsWithId = executionsData.map(execution => ({
      ...execution,
      tradeId: trade.id
    }));

    await executionRepo.addExecutions(executionsWithId, trx);

    return trade.id;
  });
}

/**
 * Retrieve a paginated list of trades and pagination metadata.
 *
 * @param page The 1-based page index to retrieve
 * @param limit The maximum number of trades to return per page
 *
 * @return The trades list and associated pagination metadata
 */
export async function getTrades(page: number, limit: number): Promise<PaginatedTradesResponse> {
  const trades = await tradeRepo.getTrades(page, limit);

  const count = await tradeRepo.getTradeCount();

  return {
    trades: trades,
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  };
}

/**
 * Delete a trade and its associated executions.
 *
 * @param id The ID of the trade
 */
export async function deleteTrade(id: number): Promise<void> {
  if (!(await tradeRepo.tradeExists(id))) {
    throw new NotFoundError(`Trade '${id}' not found.`);
  }

  await database.transaction().execute(async trx => {
    await executionRepo.deleteExecutionsByTradeId(id, trx);

    await tradeRepo.deleteTrade(id, trx);
  });
}
