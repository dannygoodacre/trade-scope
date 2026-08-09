import * as executionRepository from '@repositories/execution.repository';
import * as tradeRepository from '@repositories/trade.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppError, NotFoundError } from '@/error';

import { createTrade, deleteTrade } from './trade.service';

vi.mock('@repositories/trade.repository');

vi.mock('@repositories/execution.repository');

const testTransaction = 'Mock Transaction';

vi.mock('@/database', () => ({
  database: {
    transaction: vi.fn(() => ({
      execute: vi.fn(x => x(testTransaction))
    }))
  }
}));

describe('Trade Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTrade', () => {
    it('should add a trade and its executions', async () => {
      // Arrange
      const input = {
        date: 'Input Date',
        float: 123,
        news: 'Input News',
        newsTime: 'Input News Time',
        sector: 'Input Sector',
        symbol: 'Input Symbol',
        volume: 456,
        executions: [
          {
            filled: 789,
            madeAt: 'Input Made At 1',
            order: 101,
            Price: 'Input Price 1',
            side: 'Input Side 1'
          },
          {
            filled: 112,
            madeAt: 'Input Made At 2',
            order: 131,
            Price: 'Input Price 2',
            side: 'Input Side 2'
          }
        ]
      };

      const testTradeId = 999;

      const mockTrade = {
        id: testTradeId,
        date: 'Test Date',
        float: 415,
        news: 'Input News',
        newsTime: 'Input News Time',
        sector: 'Input Sector',
        symbol: 'Input Symbol',
        volume: 617
      };

      vi.mocked(tradeRepository.addTrade).mockResolvedValue(mockTrade);

      // Act
      const result = await createTrade(input as any);

      // Assert
      expect(result).toBe(testTradeId);

      const testTradeData = {
        date: 'Input Date',
        float: 123,
        news: 'Input News',
        newsTime: 'Input News Time',
        sector: 'Input Sector',
        symbol: 'Input Symbol',
        volume: 456
      };

      expect(tradeRepository.addTrade).toHaveBeenCalledWith(testTradeData, testTransaction);

      const testExecutions = [
        {
          filled: 789,
          madeAt: 'Input Made At 1',
          order: 101,
          Price: 'Input Price 1',
          side: 'Input Side 1',
          tradeId: testTradeId
        },
        {
          filled: 112,
          madeAt: 'Input Made At 2',
          order: 131,
          Price: 'Input Price 2',
          side: 'Input Side 2',
          tradeId: testTradeId
        }
      ];

      expect(executionRepository.addExecutions).toHaveBeenCalledWith(testExecutions, testTransaction);
    });
  });

  describe('deleteTrade', () => {
    it('should throw NotFoundError if trade does not exist', async () => {
      // Arrange
      const inputTradeId = 999;

      vi.mocked(tradeRepository.tradeExists).mockResolvedValue(false);

      // Act & Assert
      try {
        await deleteTrade(inputTradeId);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);

        expect(error).toMatchObject(new NotFoundError(`Trade '${inputTradeId}' not found.`));
      }

      expect(tradeRepository.deleteTrade).not.toHaveBeenCalled();
    });

    it('should delete trade and its transactions', async () => {
      // Arrange
      const inputTradeId = 999;

      vi.mocked(tradeRepository.tradeExists).mockResolvedValue(true);

      // Act
      await deleteTrade(inputTradeId);

      // Assert
      expect(tradeRepository.deleteTrade).toHaveBeenCalledWith(inputTradeId, testTransaction);

      expect(executionRepository.deleteExecutionsByTradeId).toHaveBeenCalledWith(inputTradeId, testTransaction);
    });
  });
});
