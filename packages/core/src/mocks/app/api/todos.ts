import { defineRoute } from '../../../define-route';

export const get = defineRoute({
  handler(_, res) {
    res.send('OK');
  },
});

export const post = defineRoute({
  handler(_, res) {
    res.send('OK');
  },
});
