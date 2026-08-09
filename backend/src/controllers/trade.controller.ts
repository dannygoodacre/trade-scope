import { Response } from 'express';

import * as tradeService from '@/services/trade.service';
import type { CreateTradeRequest, DeleteTradeRequest, GetTradeRequest, TypedRequest } from '@/types';

export async function createTrade(req: TypedRequest<CreateTradeRequest>, res: Response) {
  const { executions, ...tradeData } = req.body;

  const tradeId = await tradeService.createTrade(tradeData, executions);

  const location = `${req.protocol}://${req.host}/trades/${tradeId}`;

  return res
    .status(201)
    .location(location)
    .json({ id: tradeId });
}

export async function deleteTrade(req: TypedRequest<DeleteTradeRequest>, res: Response) {
  await tradeService.deleteTrade(Number(req.params.id));

  return res.sendStatus(204);
}

export async function getTrades(req: TypedRequest<GetTradeRequest>, res: Response) {
  const result = await tradeService.getTrades(Number(req.query.page), Number(req.query.limit));

  return res
    .status(200)
    .json(result);
}
