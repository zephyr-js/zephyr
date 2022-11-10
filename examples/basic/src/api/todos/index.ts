import { defineRoute } from '@zephyr-js/core';
import { z } from 'zod';
import { Todo, TodoSchema } from '@/models/todo';

// GET /todos
export const get = defineRoute({
  handler(req, res) {
    const todos: Todo[] = [
      {
        name: 'Workout',
        status: 'doing',
      },
    ];
    res.json({ todos });
  },
});

// POST /todos
export const post = defineRoute({
  schema: z.object({
    body: TodoSchema,
    response: z.object({
      todo: TodoSchema,
    }),
  }),
  handler(req, res) {
    const todo: Todo = req.body;
    res.json({ todo });
  },
});
