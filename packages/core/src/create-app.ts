import express, { RequestHandler } from 'express';
import { loadRoutes } from './utils/routes-loader';
import {
  createErrorMiddleware,
  createHandlerMiddleware,
  createValidationMiddleware,
} from './utils/middlewares';

type ExpressApplication = ReturnType<typeof express>;

export type ZephyrApplication = ExpressApplication;

/**
 * Creates an Express application, with routes loaded
 */
export const createApp = async (): Promise<ZephyrApplication> => {
  const app = express();

  app.use(express.json());

  const routes = await loadRoutes();

  for (const route of routes) {
    const {
      path,
      handler,
      schema,
      onRequest,
      onBeforeValidate,
      onBeforeHandle,
      onErrorCaptured,
      onResponse,
    } = route;
    const method = route.method.toLowerCase() as keyof ExpressApplication;

    const middlewares: RequestHandler[] = [];

    if (onRequest) {
      middlewares.push(createHandlerMiddleware(onRequest));
    }

    if (schema) {
      if (onBeforeValidate) {
        middlewares.push(createHandlerMiddleware(onBeforeValidate));
      }
      middlewares.push(createValidationMiddleware(schema));
    }

    if (onBeforeHandle) {
      middlewares.push(createHandlerMiddleware(onBeforeHandle));
    }
    middlewares.push(createHandlerMiddleware(handler, onErrorCaptured));

    if (onResponse) {
      middlewares.push(createHandlerMiddleware(onResponse));
    }

    app[method](path, ...middlewares);
  }

  app.use(createErrorMiddleware());

  return app;
};
