import { ZephyrHandler, ZephyrHandlerWithError } from './zephyr-handler';
import { ZephyrBaseRequest } from './zephyr-request';
import { ZephyrRoute } from './zephyr-route';

// App hooks
export type OnReadyHook = () => void | Promise<void>;
export type OnRouteHook = (route: ZephyrRoute) => void;

// Route hooks
export type OnBeforeHandleHook<
  TRequest extends ZephyrBaseRequest,
  TResponse,
> = ZephyrHandler<TRequest, TResponse>;

export type OnBeforeValidateHook<
  TRequest extends ZephyrBaseRequest,
  TResponse,
> = ZephyrHandler<TRequest, TResponse>;

export type OnRequestHook<
  TRequest extends ZephyrBaseRequest,
  TResponse,
> = ZephyrHandler<TRequest, TResponse>;

export type OnResponseHook<
  TRequest extends ZephyrBaseRequest,
  TResponse,
> = ZephyrHandler<TRequest, TResponse>;

export type OnErrorCapturedHook<
  TRequest extends ZephyrBaseRequest = any,
  TResponse = any,
  TError = unknown,
> = ZephyrHandlerWithError<TRequest, TResponse, TError>;
