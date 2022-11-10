import { ZephyrBaseRequest, ZephyrRequest } from './zephyr-request';
import { ZephyrResponse } from './zephyr-response';

export type ZephyrHandler<
  TRequest extends ZephyrBaseRequest = any,
  TResponse = any,
> = (
  req: ZephyrRequest<TRequest>,
  res: ZephyrResponse<TResponse>,
) => any | Promise<any>;

export type ZephyrHandlerWithError<
  TRequest extends ZephyrBaseRequest = any,
  TResponse = any,
  TError = unknown,
> = (
  req: ZephyrRequest<TRequest, TResponse>,
  res: ZephyrResponse<TResponse>,
  err: TError,
) => any | Promise<any>;
