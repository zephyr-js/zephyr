import { defineRoute } from '@zephyr-js/core';

// GET /
export const get = defineRoute({
  handler(req, res) {
    res.json({ message: 'Hello world!' });
  },
});
