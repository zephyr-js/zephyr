import express, { RequestHandler } from 'express';
import { loadRoutes } from './utils/routes-loader';
import {
  createErrorMiddleware,
  createHandlerMiddleware,
  createValidationMiddleware,
} from './utils/middlewares';

type ExpressApplication = ReturnType<typeof express>;

export type ZephyrApplication = ExpressApplication;

export interface CreateAppOptions<TDependencies = object> {
  dependencies?: TDependencies;
}

/**
 * Creates an Express application, with routes loaded
 */
export async function createApp<TDependencies extends object = object>({
  dependencies = Object.create(null),
}: CreateAppOptions<TDependencies> = {}): Promise<ZephyrApplication> {
  const app = express();

  app.use(express.json());

  const routes = await loadRoutes({ dependencies });

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
}
