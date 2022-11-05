import { Server, createServer, ServerResponse, IncomingMessage } from 'http';
import express, { RequestHandler } from 'express';
import { loadRoutes } from './utils/routes-loader';
import {
  createHandlerMiddleware,
  createValidationMiddleware,
} from './utils/middlewares';

type ExpressApplication = ReturnType<typeof express>;
type HttpServer = Server<typeof IncomingMessage, typeof ServerResponse>;

export type ZephyrApplication = Pick<HttpServer, 'listen' | 'on' | 'emit'>;

export const zephyr = (): ZephyrApplication => {
  // Create express app
  const app = express();

  // Create HTTP server
  const server = createServer(app);

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

  return {
    listen: server.listen,
    on: server.on,
    emit: server.emit,
  };
};
