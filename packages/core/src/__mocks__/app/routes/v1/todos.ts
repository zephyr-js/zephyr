import { defineRoute } from '../../../../define-route';

export function GET() {
  return defineRoute({
    handler() {
      return { todos: [] };
    },
  });
}

export function POST() {
  return defineRoute({
    handler() {
      return { todo: null };
    },
  });
}
