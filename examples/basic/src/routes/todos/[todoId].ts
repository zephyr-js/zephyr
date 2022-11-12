import { defineRoute } from '@zephyr-js/core';
import { Todo } from '@/models/todo';

// GET /todos/[todoId]
export const GET = defineRoute({
  handler(req, res) {
    const todo: Todo = {
      name: 'Read work emails',
      status: 'done',
    };
    res.json({ todo });
  },
});
