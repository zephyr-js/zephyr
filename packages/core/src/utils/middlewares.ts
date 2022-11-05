import { ZephyrBaseRequest, ZephyrHandlerWithSchema, ZephyrRequest, ZephyrResponse } from '@/../../common/dist';
import { ErrorRequestHandler, RequestHandler } from 'express';
import { AnyZodObject, ZodError, ZodTypeAny } from 'zod';

export const createHandlerMiddleware = <T extends ZodTypeAny>(
  handler: ZephyrHandlerWithSchema<T>,
): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (err) {
      return next(err);
    }
    return next();
  };
};

export const createValidationMiddleware = (
  schema: AnyZodObject,
): RequestHandler => {
  return (req, res) => {
    try {
      schema.parse(req);
    } catch (err) {
      if (err instanceof ZodError) {
        const { errors } = err;
        return res.status(400).json({ errors });
      }
    }
  };
};

export const createErrorMiddleware = <
  TRequest extends ZephyrBaseRequest = any,
  TResponse = any
>(fn: (req: ZephyrRequest<TRequest>, res: ZephyrResponse<TResponse>, err: unknown) => any): ErrorRequestHandler => {
  return (err, req, res, next) => {
    fn(req, res, err);
    return next();
  };
};