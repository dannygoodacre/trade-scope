import { createTrade, deleteTrade, getTrades } from '@/controllers/trade.controller';
import { buildRoutes } from '@/routes/routeBuilder';
import { CreateTradeRequestSchema, DeleteTradeRequestSchema, GetTradeRequestSchema } from '@/schemas/trade.schema';

export default buildRoutes({
  '/': [
    ['post', CreateTradeRequestSchema, createTrade],
    ['get', GetTradeRequestSchema, getTrades],
  ],
  '/:id': [['delete', DeleteTradeRequestSchema, deleteTrade]],
});
