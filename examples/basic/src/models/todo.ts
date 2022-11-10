import { z } from 'zod';

export const TodoSchema = z.object({
  name: z.string(),
  status: z.enum(['todo', 'doing', 'done']),
});

export type Todo = z.infer<typeof TodoSchema>;
