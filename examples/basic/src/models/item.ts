import { z } from 'zod';

// Model schema
export const ItemSchema = z.object({
  name: z.string(),
  price: z.number(),
});

// Model type
export type Item = z.infer<typeof ItemSchema>;
