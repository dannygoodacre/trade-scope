import sqlite3

from constants import NUM_TRADES, DB_FILENAME
from methods import generate_trade, create_tables


def main():
    conn = sqlite3.connect(DB_FILENAME)

    cursor = conn.cursor()

    create_tables(cursor)

    for trade_id in range(1, NUM_TRADES + 1):
        trade = generate_trade(trade_id)

        cursor.execute(
            """
                INSERT INTO "trades" ("id", "symbol", "sector", "date", "volume", "float", "news", "newsTime")
                VALUES (:id, :symbol, :sector, :date, :volume, :float, :news, :newsTime)
            """,
            trade
        )

        for execution in trade["executions"]:
            cursor.execute(
                """
                    INSERT INTO "executions" ("side", "price", "order", "filled", "madeAt", "tradeId")
                    VALUES (:side, :price, :order, :filled, :madeAt, :tradeId)
                """,
                execution
            )

    conn.commit()
    conn.close()

    print(f"Successfully generated {NUM_TRADES} valid trades in '{DB_FILENAME}'!")


if __name__ == "__main__":
    main()
