import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { DB } from '@/database/db';

import { addTrade, deleteTrade, tradeExists } from './trade.repository';

describe('Trade Repository', () => {
  let database: Kysely<DB>;

  beforeAll(() => {
    const schemaPath = path.resolve(__dirname, '../database/schema.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    const rawSqlite = new Database(':memory:');

    rawSqlite.exec(schemaSql);

    database = new Kysely<DB>({
      dialect: new SqliteDialect({
        database: rawSqlite,
      }),
    });
  });

  beforeEach(async () => {
    await database.deleteFrom('trades').execute();
    await database.deleteFrom('executions').execute();
  });

  afterAll(async () => {
    await database.destroy();
  });

  describe('addTrade', () => {
    it('should add the trade to the database', async () => {
      // Arrange
      const newTrade = {
        symbol: 'Input Symbol',
        date: 'Input Date',
        float: 123,
        volume: 456,
        sector: 'Input Sector',
        news: 'Input News',
        newsTime: 'Input News Time',
      };

      // Act
      const trade = await addTrade(newTrade, database);

      // Assert
      expect(trade.id).toBeDefined();

      expect(Number.isInteger(trade.id)).toBe(true);

      expect(trade.id).toBeGreaterThan(0);

      expect(trade).toStrictEqual({ id: trade.id, ...newTrade });

      const tradeInDb = await database.selectFrom('trades').selectAll().where('id', '=', trade.id).executeTakeFirst();

      expect(tradeInDb).toStrictEqual({ id: trade.id, ...newTrade });
    });
  });

  describe('deleteTradeById', () => {
    it('should delete the trade with the given ID from the database', async () => {
      // Arrange
      const newTrades = [
        {
          symbol: 'Input Symbol 1',
          date: 'Input Date 1',
          float: 123,
          volume: 456,
          sector: 'Input Sector 1',
          news: 'Input News 1',
          newsTime: 'Input News Time 1',
        },
        {
          symbol: 'Input Symbol 2',
          date: 'Input Date 2',
          float: 789,
          volume: 101,
          sector: 'Input Sector 2',
          news: 'Input News 2',
          newsTime: 'Input News Time 2',
        },
      ];

      const { id: trade1Id } = await database
        .insertInto('trades')
        .values(newTrades[0])
        .returning('id')
        .executeTakeFirstOrThrow();

      const { id: trade2Id } = await database
        .insertInto('trades')
        .values(newTrades[1])
        .returning('id')
        .executeTakeFirstOrThrow();

      // Act
      await deleteTrade(trade1Id, database);

      // Assert
      const trade1 = await database.selectFrom('trades').select('id').where('id', '=', trade1Id).executeTakeFirst();

      expect(trade1).toBeUndefined();

      const tradesInDb = await database.selectFrom('trades').select('id').execute();

      expect(tradesInDb).toHaveLength(1);

      expect(tradesInDb[0]).toEqual({ id: trade2Id });
    });
  });

  describe('tradeExists', () => {
    it('should return true when trade exists', async () => {
      // Arrange
      const newTrade = {
        symbol: 'Input Symbol',
        date: 'Input Date',
        float: 123,
        volume: 456,
        sector: 'Input Sector',
        news: 'Input News',
        newsTime: 'Input News Time',
      };

      const { id } = await database.insertInto('trades').values(newTrade).returning('id').executeTakeFirstOrThrow();

      // Act
      const result = await tradeExists(id, database);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when trade does not exist', async () => {
      // Arrange
      const id = 123;

      // Act
      const result = await tradeExists(id, database);

      // Assert
      expect(result).toBeFalsy();
    });
  });
});
