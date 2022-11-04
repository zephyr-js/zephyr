export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ZephyrBaseRequest {
  params?: object;
  query?: object;
  body?: object;
}

export interface ZephyrRequest<T extends ZephyrBaseRequest = any> {
  method: string;
  url: string;
  path: string;
  headers: Record<string, unknown>;
  params: T['params'];
  query: T['query'];
  body: T['body'];
}
