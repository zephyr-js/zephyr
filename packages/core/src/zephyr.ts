import express, { RequestHandler } from 'express';
import { loadRoutes } from './utils/routes-loader';
import {
  createErrorMiddleware,
  createHandlerMiddleware,
  createValidationMiddleware,
} from './utils/middlewares';

type ExpressApplication = ReturnType<typeof express>;
export type ZephyrApplication = ExpressApplication;

export const zephyr = async (): Promise<ZephyrApplication> => {
  // Create express app
  const app = express();
  app.use(express.json());

  // Load routes from src/api
  const routes = await loadRoutes();

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
  app.use(createErrorMiddleware());

  return app;
};
