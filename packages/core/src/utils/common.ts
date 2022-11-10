import { ZodError } from 'zod';

export const isValidationError = (err: unknown): err is ZodError => {
  return err instanceof Error && err.name === 'ZodError';
};
