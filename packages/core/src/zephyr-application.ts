import { HttpAdapter } from '@zephyrjs/common';
import { Server } from 'http';
import { loadAdapter } from './utils/adapter-loader';

export class ZephyrApplication {
  private adapter: HttpAdapter;
  private server: Server;

  constructor() {
    this.adapter = this.createAdapter();
    this.server = this.createServer();
  }

  private createAdapter() {
    return loadAdapter('@zephyrjs/express-adapter');
  }

  private createServer() {
    const server = this.adapter.gerServer();
    // TODO: Listen and react to server events
    return server;
  }

  public listen(port: number) {
    this.server.listen(port);
  }
}
