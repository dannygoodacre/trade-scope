import sqlite3
import random
from datetime import datetime, timedelta, timezone

NUM_TRADES = 10_000
DB_FILENAME = "trades.db"

SIDE_BUY = 0
SIDE_SELL = 1

SYMBOLS = ["AAPL", "TSLA", "NVDA", "AMD", "MSFT", "AMZN", "META"]
SECTORS = ["Technology", "Consumer Cyclical", "Communication Services"]
NEWS_HEADLINES = [
    "Company Announces Strong Q2 Earnings Beat",
    "FDA Approves New Product Candidate",
    "Analyst Upgrades Stock to Outperform",
    "CEO Announces Strategic Expansion Plan",
]

def random_date_in_past(days_back=365):
    """Generates a random date within the past year (not in the future)."""
    today = datetime.now(timezone.utc).date()
    random_days = random.randint(1, days_back)
    return today - timedelta(days=random_days)

def create_tables(cursor):
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS "trades" (
        "id" INTEGER NOT NULL CONSTRAINT "PK_trades" PRIMARY KEY AUTOINCREMENT,
        "symbol" TEXT NOT NULL,
        "sector" TEXT NOT NULL,
        "date" TEXT NOT NULL,
        "volume" INTEGER NOT NULL,
        "float" INTEGER NOT NULL,
        "news" TEXT NULL,
        "newsTime" TEXT NULL
    );
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS "executions" (
        "id" INTEGER NOT NULL CONSTRAINT "PK_executions" PRIMARY KEY AUTOINCREMENT,
        "side" INTEGER NOT NULL,
        "price" TEXT NOT NULL,
        "order" INTEGER NOT NULL,
        "filled" INTEGER NOT NULL,
        "madeAt" TEXT NOT NULL,
        "tradeId" INTEGER NOT NULL,
        CONSTRAINT "FK_transactions_trades_tradeId" FOREIGN KEY ("tradeId") REFERENCES "trades" ("id") ON DELETE CASCADE
    );
    """)

def generate_trade_and_executions(trade_id):
    trade_date = random_date_in_past()

    trade_date_str = trade_date.strftime("%Y-%m-%d")

    has_news = random.choice([True, False])

    news = random.choice(NEWS_HEADLINES) if has_news else None

    if has_news:
        news_dt = datetime.combine(
            trade_date,
            datetime.min.time().replace(
                hour=random.randint(8, 16), minute=random.randint(0, 59)
            ),
            tzinfo=timezone.utc,
        )
        news_time = news_dt.isoformat()
    else:
        news_time = None

    trade = {
        "id": trade_id,
        "symbol": random.choice(SYMBOLS),
        "sector": random.choice(SECTORS),
        "date": trade_date_str,
        "volume": random.randint(1_000_000, 50_000_000),
        "float": random.randint(10_000_000, 500_000_000),
        "news": news,
        "newsTime": news_time,
    }

    total_shares = random.randint(1, 10) * 100

    base_price = round(random.uniform(10.0, 300.0), 2)

    # Random split of one or two buys/sells

    buy_fills = []

    if random.choice([True, False]):
        first_fill = total_shares // 2

        buy_fills.append(first_fill)

        buy_fills.append(total_shares - first_fill)

    else:
        buy_fills.append(total_shares)

    sell_fills = []

    if random.choice([True, False]):
        first_fill = total_shares // 2

        sell_fills.append(first_fill)

        sell_fills.append(total_shares - first_fill)

    else:
        sell_fills.append(total_shares)

    executions = []

    order = 1

    base_time = datetime.combine(
        trade_date, datetime.min.time().replace(hour=9, minute=30), tzinfo=timezone.utc
    )

    for shares in buy_fills:
        fill_time = base_time + timedelta(minutes=random.randint(0, 30))
        executions.append({
            "side": SIDE_BUY,
            "price": f"{base_price:.2f}",
            "order": order,
            "filled": shares,
            "madeAt": fill_time.isoformat(),
            "tradeId": trade_id,
        })
        order += 1

    for shares in sell_fills:
        fill_time = base_time + timedelta(minutes=random.randint(31, 120))
        pnl = random.uniform(-2.0, 5.0)
        exit_price = max(0.01, round(base_price + pnl, 2))
        executions.append({
            "side": SIDE_SELL,
            "price": f"{exit_price:.2f}",
            "order": order,
            "filled": shares,
            "madeAt": fill_time.isoformat(),
            "tradeId": trade_id,
        })
        order += 1

    return trade, executions

def main():
    conn = sqlite3.connect(DB_FILENAME)
    cursor = conn.cursor()

    create_tables(cursor)

    for trade_id in range(1, NUM_TRADES + 1):
        trade, executions = generate_trade_and_executions(trade_id)

        cursor.execute(
            """
                INSERT INTO "trades" ("id", "symbol", "sector", "date", "volume", "float", "news", "newsTime")
                VALUES (:id, :symbol, :sector, :date, :volume, :float, :news, :newsTime)
            """,
            trade,
        )

        for ex in executions:
            cursor.execute(
                """
                    INSERT INTO "executions" ("side", "price", "order", "filled", "madeAt", "tradeId")
                    VALUES (:side, :price, :order, :filled, :madeAt, :tradeId)
                """,
                ex,
            )

    conn.commit()
    conn.close()
    print(f"Successfully generated {NUM_TRADES} valid trades in '{DB_FILENAME}'!")

if __name__ == "__main__":
    main()
