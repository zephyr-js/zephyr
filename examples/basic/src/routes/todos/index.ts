import { defineRoute } from '@zephyr-js/core';
import { z } from 'zod';
import { Todo, TodoSchema } from '@/models/todo';

// GET /todos
export function GET() {
  return defineRoute({
    handler(req, res) {
      const todos: Todo[] = [
        {
          name: 'Workout',
          status: 'doing',
        },
      ];
      return { todos };
    },
  });
}

// POST /todos
export function POST() {
  return defineRoute({
    schema: z.object({
      body: TodoSchema,
      response: z.object({
        todo: TodoSchema,
      }),
    }),
    handler(req, res) {
      const todo: Todo = req.body;
      return { todo };
    },
  });
}
