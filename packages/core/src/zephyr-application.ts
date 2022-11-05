import { Server, createServer } from 'http';
import express, { RequestHandler } from 'express';
import { loadRoutes } from './utils/routes-loader';
import { ExpressRequestMethod } from '@zephyr/common';
import {
  createHandlerMiddleware,
  createValidationMiddleware,
} from './utils/middlewares';

type ExpressApplication = ReturnType<typeof express>;

export class ZephyrApplication {
  private app: ExpressApplication;
  private server: Server;

  constructor() {
    this.app = this.createApp();
    this.server = this.createServer(this.app);
    this.loadRoutes();
  }

  private createApp() {
    const app = express();
    return app;
  }

  private createServer(app: ExpressApplication) {
    const server = createServer(app);
    // TODO: Listen and react to server events
    return server;
  }

  public loadRoutes() {
    const routes = loadRoutes();

    console.log(routes);

    for (const route of routes) {
      const { path, handler, schema } = route;
      const method = route.method.toLowerCase() as ExpressRequestMethod;

      const middlewares: RequestHandler[] = [];

      if (schema) {
        middlewares.push(createValidationMiddleware(schema));
      }

      middlewares.push(createHandlerMiddleware(handler));

      this.app[method](path, ...middlewares);
    }
  }

  public listen(port: number, callback: () => void) {
    this.server.listen(port, callback);
  }
}
