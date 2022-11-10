import type { AnyZodObject } from 'zod';
import { ZephyrHandler } from './zephyr-handler';
import {
  OnBeforeHandleHook,
  OnBeforeValidateHook,
  OnErrorCapturedHook,
  OnRequestHook,
  OnResponseHook,
} from './zephyr-hooks';
import { ZephyrBaseRequest } from './zephyr-request';

export const ROUTE_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

export type RouteMethod = typeof ROUTE_METHODS[number];

export interface ZephyrRoute<
  TRequest extends ZephyrBaseRequest = any,
  TResponse = any,
> extends ZephyrRouteHooks<TRequest, TResponse> {
  name?: string;
  method: RouteMethod;
  path: string;
  schema?: AnyZodObject;
  handler: ZephyrHandler<TRequest, TResponse>;
}

export interface ZephyrRouteHooks<
  TRequest extends ZephyrBaseRequest,
  TResponse,
> {
  onRequest?: OnRequestHook<TRequest, TResponse>;
  onBeforeHandle?: OnBeforeHandleHook<TRequest, TResponse>;
  onBeforeValidate?: OnBeforeValidateHook<TRequest, TResponse>;
  onResponse?: OnResponseHook<TRequest, TResponse>;
  onErrorCaptured?: OnErrorCapturedHook<TRequest, TResponse, unknown>;
}
