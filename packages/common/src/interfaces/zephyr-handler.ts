import type { AnyZodObject, z } from 'zod';
import { ZephyrBaseRequest, ZephyrRequest } from './zephyr-request';
import { ZephyrResponse } from './zephyr-response';

export type ZephyrHandler<
  TRequest extends ZephyrBaseRequest = any,
  TResponse = any,
> = (
  req: ZephyrRequest<TRequest>,
  res: ZephyrResponse<TResponse>,
) => any | Promise<any>;

export type ZephyrHandlerWithSchema<TSchema extends AnyZodObject = any> = (
  req: ZephyrRequest<
    Omit<z.infer<TSchema>, 'response'>,
    z.infer<TSchema>['response']
  >,
  res: ZephyrResponse<z.infer<TSchema>['response']>,
) => any | Promise<any>;

export type ZephyrHandlerAny = ZephyrHandler | ZephyrHandlerWithSchema;
