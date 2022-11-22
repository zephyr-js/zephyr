import {
  OnErrorCapturedHook,
  ZephyrBaseRequest,
  ZephyrHandler,
  ZephyrRequest,
  ZephyrResponse,
  ZephyrRouteSchema,
} from '@zephyr-js/common';
import { ErrorRequestHandler, RequestHandler } from 'express';
import { ServerResponse } from 'http';
import { isValidationError } from './common';

export const createHandlerMiddleware = (
  handler: ZephyrHandler,
  onErrorCaptured?: OnErrorCapturedHook,
): RequestHandler => {
  return async (req, res, next) => {
    try {
      const body = await handler(req, res);
      if (body && !(body instanceof ServerResponse) && !res.headersSent) {
        switch (typeof body) {
        case 'string': {
          res.send(body);
          break;
        }
        case 'object': {
          res.json(body);
          break;
        }
        }
      }
    } catch (err) {
      if (onErrorCaptured) {
        console.error(err);
        onErrorCaptured(req, res, err);
      } else {
        return next(err);
      }
    }
    return next();
  };
};

export const createValidationMiddleware = (
  schema: ZephyrRouteSchema,
): RequestHandler => {
  return (req, _, next) => {
    try {
      schema
        .pick({
          params: true,
          body: true,
          query: true,
        })
        .parse(req);
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
  req: ZephyrRequest<TRequest>,
  res: ZephyrResponse<TResponse>,
  err: TError,
) => any;

const defaultOnErrorCaptured: OnErrorCapturedHook = (_, res, err) => {
  if (isValidationError(err)) {
    const { errors } = err;
    return res.status(400).json({ errors });
  }
  return res.status(500).send('Internal server error');
};

export const createErrorMiddleware = (
  onErrorCaptured = defaultOnErrorCaptured,
): ErrorRequestHandler => {
  return (err, req, res, next) => {
    console.error(err);
    onErrorCaptured(req, res, err);
    return next();
  };
};
