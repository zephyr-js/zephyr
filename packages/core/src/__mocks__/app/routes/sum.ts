import { inject } from '@zephyr-js/di';
import { z } from 'zod';
import { defineRoute } from '../../../define-route';
import { INJECTION_KEYS } from '../di';

export const POST = defineRoute({
  schema: z.object({
    body: z.object({
      x: z.number(),
      y: z.number(),
    }),
  }),
  handler(req, res) {
    const calculator = inject(INJECTION_KEYS.CALCULATOR);
    const { x, y } = req.body;
    const answer = calculator.sum(x, y);
    return res.send(answer.toString());
  },
});
