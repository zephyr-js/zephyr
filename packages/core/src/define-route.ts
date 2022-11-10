import {
  ZephyrBaseRequest,
  ZephyrHandler,
  ZephyrRouteHooks,
} from '@zephyr-js/common';
import { AnyZodObject, z } from 'zod';

type RequestFromSchema<T extends AnyZodObject> = Omit<z.infer<T>, 'response'>;
type ResponseFromSchema<T extends AnyZodObject> = z.infer<T>['response'];

export type DefineRouteOptions<
  TRequest extends ZephyrBaseRequest = any,
  TResponse = any,
  TSchema extends AnyZodObject = any,
> = {
  name?: string;
  schema?: TSchema;
  handler: ZephyrHandler<TRequest, TResponse>;
} & ZephyrRouteHooks<TRequest, TResponse>;

export function defineRoute<
  TSchema extends AnyZodObject = any,
  TRequest extends ZephyrBaseRequest = RequestFromSchema<TSchema>,
  TResponse = ResponseFromSchema<TSchema>,
>(options: DefineRouteOptions<TRequest, TResponse, TSchema>) {
  return options;
}
