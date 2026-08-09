import type { ExecutionData } from '@trade-tracker/shared/types';
import { ExecutionDataShape } from '@trade-tracker/shared/schemata';

export const CreateExecutionRequestSchema = ExecutionDataShape
.refine(filledIsLeqThanOrder, {
  message: "'filled' must be less than or equal to 'order'",
  path: ['filled'],
})
.transform(execution => ({
  ...execution,
  madeAt: new Date(execution.madeAt).toISOString(),
}));

function filledIsLeqThanOrder(execution: ExecutionData): boolean {
  return execution.filled <= execution.order;
}
