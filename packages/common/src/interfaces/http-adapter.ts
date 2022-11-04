import { Server } from 'http';
import { ZephyrHandler } from './zephyr-handler';
import { RequestMethod } from './zephyr-request';

export type ValidAdapter =
  | '@zephyrjs/express-adapter'
  | '@zephyrjs/koa-adapter';

export abstract class HttpAdapter<TApp = any, TFunction = Function> {
  constructor(
    protected readonly app: TApp,
    protected readonly server: Server,
  ) {}

  public use(path: string, ...functions: TFunction[]) {}

  public register(
    method: RequestMethod,
    path: string,
    handler: ZephyrHandler
  ) {}

  public listen(port: number) {}

  public gerServer() {
    return this.server;
  }
}
