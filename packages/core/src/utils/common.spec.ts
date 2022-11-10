import { describe, expect, test } from 'vitest';
import { ZodError } from 'zod';
import { isValidationError } from './common';

describe('isValidationError', () => {
  test('should return true', () => {
    const err = new ZodError([]);
    expect(isValidationError(err)).toBeTruthy();
  });
});
