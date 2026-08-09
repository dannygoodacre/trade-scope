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

CREATE INDEX "IX_executions_tradeId" ON executions ("tradeId");
