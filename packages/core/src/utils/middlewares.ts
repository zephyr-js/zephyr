import {
  ZephyrBaseRequest,
  ZephyrHandlerAny,
  ZephyrRequest,
  ZephyrResponse,
} from '@zephyr-js/common';
import { ErrorRequestHandler, RequestHandler } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const createHandlerMiddleware = (
  handler: ZephyrHandlerAny,
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
  return (req, _, next) => {
    try {
      schema.omit({ response: true }).parse(req);
    } catch (err) {
      return next(err);
    }
    return next();
  };
};

export type ErrorFunction<
  TError = unknown,
  TRequest extends ZephyrBaseRequest = any,
  TResponse = any,
> = (
  err: TError,
  req: ZephyrRequest<TRequest>,
  res: ZephyrResponse<TResponse>,
) => any;

const isZodError = (err: unknown): err is ZodError => {
  return err instanceof Error && err.name === 'ZodError';
};

export const createErrorMiddleware = (
  fn?: ErrorFunction,
): ErrorRequestHandler => {
  return (err, req, res, next) => {
    console.error(err);

    if (fn) {
      fn(err, req, res);
      return next();
    }

    if (isZodError(err)) {
      const { errors } = err;
      return res.status(400).json({ errors });
    }

    return res.status(500).send('Internal server error');
  };
};
