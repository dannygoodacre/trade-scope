import { z } from 'zod';

import { Side } from '@trade-tracker/shared/enums';

export const ExecutionDataShape = z.strictObject({
  filled: z.number().positive(),
  madeAt: z.iso.datetime({ offset: true }),
  order: z.number().int(),
  price: z.string().regex(/^\d+(\.\d+)?$/, {
    error: 'Price must be a valid positive real number.',
  }),
  side: z.enum(Side),
});

export const ExecutionShape = ExecutionDataShape.extend({
  id: z.number().int().positive(),
});
