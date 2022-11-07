import { z } from 'zod';
import { ZephyrHandlerWithSchema } from '@zephyr-js/common';
import { Item, ItemSchema } from '@/models/item';

// Endpoint schema, auto validated with Zod
// Supports `params`, `body`, `query` and `response`
export const schema = z.object({
  // Request body
  body: ItemSchema,
  // Response body
  response: z.object({
    item: ItemSchema,
  }),
});

// Endpoint handler
export const handler: ZephyrHandlerWithSchema<typeof schema> = async (
  req,
  res,
) => {
  const item: Item = req.body; // Type checked
  return res.json({ item }); // Type checked
};
