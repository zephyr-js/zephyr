import { defineRoute } from '@zephyr-js/core';

export function GET() {
  return defineRoute({
    handler(req, res) {
      return { message: 'Hello world!' };
    },
  });
}
