import express from 'express';
import { loadRoutes } from './utils/routes-loader';
import { createRouter } from './create-router';

export type ZephyrApplication = ReturnType<typeof express>;

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

  const router = createRouter(routes);

  app.use(router);

  return app;
}
