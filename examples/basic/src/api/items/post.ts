import { z } from 'zod';
import { ZephyrHandlerWithSchema } from '@zephyr-js/common';

// Model schema
const ItemSchema = z.object({
  name: z.string(),
  price: z.number(),
});

// Model type
type Item = z.infer<typeof ItemSchema>;

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
