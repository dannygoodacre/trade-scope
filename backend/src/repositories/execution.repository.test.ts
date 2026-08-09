import * as fs from 'fs';
import * as path from 'node:path';
import { Side } from '@trade-tracker/shared/enums';
import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { DB } from '@/database/db';
import { addExecutions, deleteExecutionsByTradeId } from '@/repositories/execution.repository';
import { addTrade } from '@/repositories/trade.repository';

describe('Execution Repository', () => {
  let database: Kysely<DB>;

  beforeAll(() => {
    const schemaPath = path.resolve(__dirname, '../database/schema.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    const rawSqlite = new Database(':memory:');

    rawSqlite.exec(schemaSql);

    database = new Kysely<DB>({
      dialect: new SqliteDialect({
        database: rawSqlite
      })
    });
  });

  beforeEach(async () => {
    await database.deleteFrom('trades').execute();
    await database.deleteFrom('executions').execute();
  });

  afterAll(async () => {
    await database.destroy();
  });

  describe('addExecutions', () => {
    it('should add all executions to the database', async () => {
      // Arrange
      const newTrade = {
        symbol: 'Input Symbol',
        date: 'Input Date',
        float: 123,
        volume: 456,
        sector: 'Input Sector',
        news: 'Input News',
        newsTime: 'Input News Time'
      };

      const { id } = await addTrade(newTrade, database);

      const newExecutions = [
        {
          filled: 123,
          madeAt: 'Input Made At 1',
          order: 456,
          price: 'Input Price 1',
          side: Side.Sell,
          tradeId: id
        },
        {
          filled: 789,
          madeAt: 'Input Made At 2',
          order: 101,
          price: 'Input Price 2',
          side: Side.Buy,
          tradeId: id
        }
      ];

      // Act
      const executions = await addExecutions(newExecutions, database);

      // Assert
      expect(executions).toHaveLength(2);

      expect(executions).toEqual([
        expect.objectContaining({ id: expect.any(Number) }),
        expect.objectContaining({ id: expect.any(Number) })
      ]);

      executions.forEach(execution => {
        expect(Number.isInteger(execution.id)).toBe(true);

        expect(execution.id).toBeGreaterThan(0);
      });
    });
  });

  describe('deleteExecutionsByTradeId', () => {
    it('should delete the executions associated with the given trade ID from the database', async () => {
      // Arrange
      const newTrade1 = {
        symbol: 'Input Symbol 1',
        date: 'Input Date 1',
        float: 123,
        volume: 456,
        sector: 'Input Sector 1',
        news: 'Input News 1',
        newsTime: 'Input News Time 1'
      };

      const { id: tradeId1 } = await addTrade(newTrade1, database);

      const newTrade2 = {
        symbol: 'Input Symbol 2',
        date: 'Input Date 2',
        float: 123,
        volume: 456,
        sector: 'Input Sector 2',
        news: 'Input News 2',
        newsTime: 'Input News Time 2'
      };

      const { id: tradeId2 } = await addTrade(newTrade2, database);

      const newExecutions = [
        {
          filled: 123,
          madeAt: 'Input Made At 1',
          order: 456,
          price: 'Input Price 1',
          side: Side.Sell,
          tradeId: tradeId1
        },
        {
          filled: 789,
          madeAt: 'Input Made At 2',
          order: 101,
          price: 'Input Price 2',
          side: Side.Buy,
          tradeId: tradeId2
        },
        {
          filled: 112,
          madeAt: 'Input Made At 3',
          order: 131,
          price: 'Input Price 3',
          side: Side.Buy,
          tradeId: tradeId2
        }
      ];

      await addExecutions(newExecutions, database);

      // Act
      const result = await deleteExecutionsByTradeId(tradeId1, database);

      // Assert
      expect(result.numDeletedRows).toEqual(1n);

      const executionsForTrade1 = await database
        .selectFrom('executions')
        .selectAll()
        .where('tradeId', '=', tradeId2)
        .execute();

      expect(executionsForTrade1).toHaveLength(2);

      expect(executionsForTrade1).toEqual(newExecutions.slice(1, 3).map(x => ({ ...x, id: expect.any(Number) })));

      const executionsForTrade2 = await database
        .selectFrom('executions')
        .selectAll()
        .where('tradeId', '=', tradeId1)
        .execute();

      expect(executionsForTrade2).toHaveLength(0);
    });
  });
});
