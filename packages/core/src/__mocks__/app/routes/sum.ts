import { z } from 'zod';
import { container } from '@zephyr-js/di';
import { defineRoute } from '../../../define-route';
import { Calculator } from '../services/calculator';

export const POST = defineRoute({
  schema: z.object({
    body: z.object({
      x: z.number(),
      y: z.number(),
    }),
  }),
  handler(req, res) {
    const calculator = container.inject(Calculator);
    const { x, y } = req.body;
    const answer = calculator.sum(x, y);
    return res.send(answer.toString());
  },
});
