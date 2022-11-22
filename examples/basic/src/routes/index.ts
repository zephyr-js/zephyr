import { defineRoute } from '@zephyr-js/core';

// GET /
export function GET() {
  return defineRoute({
    handler(req, res) {
      return { message: 'Hello world!' };
    },
  });
}
