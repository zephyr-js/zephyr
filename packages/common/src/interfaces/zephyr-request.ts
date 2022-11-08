import type { Request as ExpressRequest } from 'express';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ZephyrBaseRequest {
  params?: object;
  query?: object;
  body?: object;
}

export type ZephyrRequest<
  T extends ZephyrBaseRequest = any,
  TResponse = any,
> = ExpressRequest<T['params'], TResponse, T['body'], T['query']>;
