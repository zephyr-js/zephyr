import { defineRoute } from '../../../define-route';

export const get = defineRoute({
  handler(_, res) {
    res.send('OK');
  },
});
