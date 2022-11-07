import { ZodError } from 'zod';

export const isZodError = (err: unknown): err is ZodError => {
  return err instanceof Error && err.name === 'ZodError';
};
