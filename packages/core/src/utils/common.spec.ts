import { describe, expect, test } from 'vitest';
import { ZodError } from 'zod';
import { isZodError } from './common';

describe('Common utils', () => {
  test('Is Zod error', () => {
    const err = new ZodError([]);
    expect(isZodError(err)).toBeTruthy();
  });
});
