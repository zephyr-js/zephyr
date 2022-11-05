import express, { RequestHandler } from 'express';
import { loadRoutes } from './utils/routes-loader';
import {
  createErrorMiddleware,
  createHandlerMiddleware,
  createValidationMiddleware,
} from './utils/middlewares';

type ExpressApplication = ReturnType<typeof express>;

export type ZephyrApplication = {
  listen: (port: number, callback?: () => void) => void;
};

export const zephyr = (): ZephyrApplication => {
  // Create express app
  const app = express();
  app.use(express.json());

  // Load routes from src/api
  const routes = loadRoutes();

  // Register routes
  for (const route of routes) {
    const { path, handler, schema } = route;
    const method = route.method.toLowerCase() as keyof ExpressApplication;

    const middlewares: RequestHandler[] = [];

    // Create validation middleware when schema is exported
    if (schema) {
      middlewares.push(createValidationMiddleware(schema));
    }

    // Create handler middleware
    middlewares.push(createHandlerMiddleware(handler));

    // Register route
    app[method](path, ...middlewares);
  }

  // Create error middleware
  app.use('/', createErrorMiddleware());

  const listen: ZephyrApplication['listen'] = (
    port: number,
    callback?: () => void,
  ) => {
    app.listen(port, callback);
  };

  return {
    listen,
  };
};
