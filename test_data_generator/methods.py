import random
from datetime import datetime, timedelta, timezone

from constants import SIDE_SELL, SIDE_BUY, NEWS_HEADLINES, SYMBOLS


def random_date_in_past(days_back = 365):
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


def generate_trade(trade_id: int):
    sector = random.choice(list(SYMBOLS.keys()))

    trade_date = random_date_in_past(3 * 365)

    trade_date_str = trade_date.strftime("%Y-%m-%d")

    has_news = random.choice([True, False])

    if has_news:
        news = random.choice(NEWS_HEADLINES)
        news_time = datetime.combine(
            trade_date,
            datetime.min.time().replace(
                hour=random.randint(8, 16),
                minute=random.randint(0, 59)
            ),
            tzinfo=timezone.utc
        ).isoformat()

    else:
        news = None
        news_time = None

    total_shares = 100 * random.randint(1, 10)

    base_price = round(random.uniform(10.0, 300.0), 2)

    if random.choice([True, False]):
        first = total_shares // 2

        buys = [first, total_shares - first]

    else:
        buys = [total_shares]

    if random.choice([True, False]):
        first = total_shares // 2

        sells = [first, total_shares - first]

    else:
        sells = [total_shares]

    executions = []

    order = 1

    base_time = datetime.combine(
        trade_date, datetime.min.time().replace(hour=9, minute=30), tzinfo=timezone.utc
    )

    for shares in buys:
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

    for shares in sells:
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

    return {
        "id": trade_id,
        "sector": sector,
        "symbol": random.choice(SYMBOLS[sector]),
        "date": trade_date_str,
        "volume": random.randint(1_000_000, 50_000_000),
        "float": random.randint(10_000_000, 500_000_000),
        "news": news,
        "newsTime": news_time,
        "executions": executions
    }
