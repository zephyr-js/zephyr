import { defineRoute } from '@zephyr-js/core';

export const get = defineRoute({
  handler(req, res) {
    return res.json({ message: 'Hello world!' });
  },
});
