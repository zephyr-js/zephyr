import { defineRoute } from '@zephyr-js/core';
import { z } from 'zod';

export function GET() {
  return defineRoute({
    schema: z.object({
      response: z.object({
        message: z.string(),
      }),
    }),
    handler() {
      return { message: 'Hello world!' };
    },
  });
}
