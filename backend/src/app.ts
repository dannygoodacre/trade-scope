import cors from 'cors';
import express from 'express';

import config from '@/config';
import { globalErrorHandler, notFoundHandler } from '@/middleware/common';
import analyticsRouter from '@/routes/analytics.routes';
import tradeRouter from '@/routes/trade.routes';

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.use(express.json());

app.use('/api/trades', tradeRouter);

app.use('/api/analytics', analyticsRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
