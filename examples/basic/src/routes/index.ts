import { defineRoute } from '@zephyr-js/core';

// GET /
export const GET = defineRoute({
  handler(req, res) {
    res.json({ message: 'Hello world!' });
  },
});
