import { Response } from 'express';

import * as analyticsService from '@/services/analytics.service';

import { GetProfitLossRequest } from './analytics.types';

import type { TypedRequest } from '@/types';

export async function getProfitLoss(req: TypedRequest<GetProfitLossRequest>, res: Response) {
  const result = await analyticsService.getProfitLoss(
    req.query.from,
    req.query.to,
    req.query.interval,
    req.query.symbol,
  );

  return res.status(200).json(result);
}
