import { createTrade, deleteTrade, getTrades } from '@/controllers/trade.controller';
import { CreateTradeRequestSchema, DeleteTradeRequestSchema, GetTradeRequestSchema } from '@/schemata/trade.schema';
import { buildRoutes } from '@/routes/routeBuilder';

export default buildRoutes({
  '/' : [
    [ 'post', CreateTradeRequestSchema, createTrade ],
    [ 'get', GetTradeRequestSchema, getTrades ],
  ],
  '/:id': [
    [ 'delete', DeleteTradeRequestSchema, deleteTrade ],
  ],
});
