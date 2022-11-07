import { z } from 'zod';
import { ZephyrHandlerWithSchema } from '@zephyr-js/common';
import { ItemSchema, Item } from '@/models/item';

export const schema = z.object({
  params: z.object({
    itemId: z.string(),
  }),
  response: z.object({
    item: ItemSchema,
  }),
});

export const handler: ZephyrHandlerWithSchema<typeof schema> = (req, res) => {
  const { itemId } = req.params; // Retrieved from dynamic route parameter `[itemId]`

  const item: Item = {
    id: itemId,
    name: 'Coffee',
    price: 8,
  };

  return res.json({ item });
};
