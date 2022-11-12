import { defineRoute } from '@zephyr-js/core';

export const GET = defineRoute({
  handler(req, res) {
    return res.json({ message: 'Hello world!' });
  },
});
