import type { RequestHandler } from 'express';
import type { AnyZodObject } from 'zod';
import { ZephyrHandler } from './zephyr-handler';
import { ZephyrBaseRequest } from './zephyr-request';

export interface ZephyrRoute<
  TRequest extends ZephyrBaseRequest = any,
  TResponse = any,
> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  schema?: AnyZodObject;
  handler: ZephyrHandler<TRequest, TResponse>;
  before?: RequestHandler | RequestHandler[];
  after?: RequestHandler | RequestHandler[];
}

export const ROUTE_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;
