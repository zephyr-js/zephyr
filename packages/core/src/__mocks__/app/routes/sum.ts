import { z } from 'zod';
import { defineRoute } from '../../../define-route';
import { Calculator } from '../services/calculator';

export function POST({ calculator }: { calculator: Calculator }) {
  return defineRoute({
    schema: z.object({
      body: z.object({
        x: z.number(),
        y: z.number(),
      }),
    }),
    handler(req, res) {
      const { x, y } = req.body;
      const answer = calculator.sum(x, y);
      return res.send(answer.toString());
    },
  });
}
