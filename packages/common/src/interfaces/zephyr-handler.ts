import { z, ZodTypeAny } from 'zod';
import { ZephyrBaseRequest, ZephyrRequest } from './zephyr-request';
import { ZephyrResponse } from './zephyr-response';

export type ZephyrHandler<TRequest extends ZephyrBaseRequest = any, TResponse = any> = (
  req: ZephyrRequest<TRequest>,
  res: ZephyrResponse<TResponse>,
) => Promise<void>;

export type ZephyrHandlerWithSchema<TSchema extends ZodTypeAny = any> = (
  req: ZephyrRequest<Omit<z.infer<TSchema>, 'response'>>,
  res: ZephyrResponse<z.infer<TSchema>['response']>
) => Promise<z.infer<TSchema>['response']>;

export type ZephyrHandlerAny = ZephyrHandler | ZephyrHandlerWithSchema;