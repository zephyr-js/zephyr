import { ZephyrHandler } from './zephyr-handler';
import { ZephyrBaseRequest } from './zephyr-request';

export type ZephyrMiddleware<TRequest extends ZephyrBaseRequest> =
  ZephyrHandler<TRequest>;
