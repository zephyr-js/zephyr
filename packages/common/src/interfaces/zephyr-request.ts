import type { Request as ExpressRequest } from 'express';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type ExpressRequestMethod = 'get' | 'post' | 'put' | 'delete';

export interface ZephyrBaseRequest {
  params?: object;
  query?: object;
  body?: object;
}

export type ZephyrRequest<T extends ZephyrBaseRequest = any> = ExpressRequest<
  T['params'],
  T['body'],
  T['query']
>;
