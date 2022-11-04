import { HttpAdapter, RequestMethod, ZephyrHandler, ZephyrRequest, ZephyrResponse } from '@zephyrjs/common';
import express, { RequestHandler } from 'express';
import { createServer } from 'http';

type ExpressRequestMethod = 'get' | 'post' | 'put' | 'delete';

type Express = ReturnType<typeof express>;

export class ExpressAdapter extends HttpAdapter<Express, RequestHandler> {
  constructor() {
    const app = express();
    const server = createServer(app);
    super(app, server);
  }

  public use(path: string, ...handlers: RequestHandler[]): Express {
    return this.instance.use(path, ...handlers);
  }

  public register(method: RequestMethod, path: string, handler: ZephyrHandler): Express {
    return this.instance[method.toLowerCase() as ExpressRequestMethod](path, this.createHandler(handler));
  }

  private createHandler(handler: ZephyrHandler): RequestHandler {
    return async (req, res, next) => {
      const request: ZephyrRequest = {
        method: req.method,
        url: req.url,
        path: req.path,
        params: req.params,
        query: req.query,
        body: req.body,
        headers: req.headers,
      };
  
      const response = new ZephyrResponse();

      try {
        await handler(request, response);
        return res.status(response.code).json(response.body);
      } catch (err) {
        next(err);
      }
    }
  }

  public listen(port: number): void {
    this.instance.listen(port);
  }
}
