import { describe, test, assertType, expectTypeOf } from 'vitest';
import { z } from 'zod';
import { defineRoute } from './define-route';

describe('Route schema type inference', () => {
  test('should able to inference req.params type', () => {
    defineRoute({
      schema: z.object({
        params: z.object({
          id: z.number(),
          email: z.string(),
          phone: z.string().optional(),
        }),
      }),
      handler(req) {
        type Expected = {
          id: number;
          email: string;
          phone?: string;
        };
        assertType<Expected>(req.params);
      },
    });
  });

  test('should able to inference req.query type', () => {
    defineRoute({
      schema: z.object({
        query: z.object({
          skip: z.number().optional(),
          limit: z.number().optional(),
          q: z.string().optional(),
          active: z.boolean().optional(),
        }),
      }),
      handler(req) {
        type Expected = {
          skip?: number;
          limit?: number;
          q?: string;
          active?: boolean;
        };
        assertType<Expected>(req.query);
      },
    });
  });

  test('should able to inference req.body type', () => {
    defineRoute({
      schema: z.object({
        body: z.object({
          id: z.number(),
          success: z.boolean(),
        }),
      }),
      handler(req) {
        type Expected = {
          id: number;
          success: boolean;
        };
        assertType<Expected>(req.body);
      },
    });
  });

  test('should able to inference res.json type', () => {
    defineRoute({
      schema: z.object({
        response: z.object({
          firstName: z.string(),
          lastName: z.string().optional(),
          email: z.string(),
          gender: z.enum(['male', 'female']),
        }),
      }),
      handler(_, res) {
        type Expected =
          | {
              firstName: string;
              lastName?: string;
              email: string;
              gender: 'male' | 'female';
            }
          | undefined;
        expectTypeOf(res.json).parameter(0).toEqualTypeOf<Expected>();
      },
    });
  });
});
