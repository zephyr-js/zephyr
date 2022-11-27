import { ZephyrRoute } from '@zephyr-js/common';
import { RequestHandler, Router } from 'express';
import {
  createErrorMiddleware,
  createHandlerMiddleware,
  createValidationMiddleware,
} from './utils/middlewares';

/**
 * Create a main router with loaded routes
 * @param routes Instances of `ZephyrRoute`
 * @returns {Router} `Router`
 */
export function createRouter(routes: ZephyrRoute[]): Router {
  const router = Router();

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

    const method = route.method.toLowerCase() as
      | 'get'
      | 'post'
      | 'put'
      | 'delete'
      | 'patch';

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

    router[method](path, ...middlewares);
  }

  router.use(createErrorMiddleware());

  return router;
}
