import { getProfitLoss } from '@/controllers/analytics.controller';
import { GetProfitLossRequestSchema } from '@/controllers/analytics.schema';
import { buildRoutes } from '@/routes/routeBuilder';

export default buildRoutes({
  '/profit-loss': [['get', GetProfitLossRequestSchema, getProfitLoss]],
});
