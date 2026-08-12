import cors from 'cors';
import express from 'express';

import config from '@/config';
import { globalErrorHandler, notFoundHandler } from '@/middleware/common';
import tradeRouter from '@/routes/trade.routes';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.use(express.json());

app.use('/api/trades', tradeRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(config.port, () => {
  console.log(`Server started on ${config.port}`);
});
