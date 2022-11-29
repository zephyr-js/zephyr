import express, { RequestHandler } from 'express';
import { CorsOptions, CorsOptionsDelegate } from 'cors';
import { OptionsJson } from 'body-parser';
import { loadRoutes } from './utils/routes-loader';
import { createRouter } from './create-router';
import {
  Application,
  ApplicationRequestHandler,
} from 'express-serve-static-core';

export interface ZephyrApplication extends Omit<Application, 'listen'> {
  listen(port?: number): Promise<void>;
  use: ApplicationRequestHandler<Application>;
}

export interface CreateAppOptions<TDependencies = object> {
  cors?: boolean | CorsOptions | CorsOptionsDelegate;
  json?: boolean | OptionsJson;
  dependencies?: TDependencies;
  middlewares?: RequestHandler[];
}

/**
 * Creates an Express application, with routes loaded
 */
export async function createApp<TDependencies extends object = object>({
  dependencies = Object.create(null),
  middlewares = [],
}: CreateAppOptions<TDependencies> = {}): Promise<ZephyrApplication> {
  const app = express();

  if (middlewares.length) {
    app.use(...middlewares);
  }

  const routes = await loadRoutes({ dependencies });

  const router = createRouter(routes);

  app.use(router);

  function listen(port?: number) {
    return new Promise<void>((resolve, reject) => {
      app
        .listen(port, () => {
          console.info(
            'Zephyr application is ready on',
            `http://localhost:${port}`,
          );
          resolve();
        })
        .on('error', (err) => reject(err));
    });
  }

  const proxy = new Proxy(app as unknown as ZephyrApplication, {
    get(target, prop) {
      if (prop === 'listen') {
        return listen;
      }
      return Reflect.get(target, prop);
    },
  });

  return proxy;
}
