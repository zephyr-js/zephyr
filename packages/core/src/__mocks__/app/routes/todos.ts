import { defineRoute } from '../../../define-route';

export const GET = defineRoute({
  handler(_, res) {
    res.send('OK');
  },
});

export const POST = defineRoute({
  handler(_, res) {
    res.send('OK');
  },
});
