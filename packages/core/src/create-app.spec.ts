import supertest from 'supertest';
import { afterEach, describe, expect, test, vi } from 'vitest';
import got from 'got';
import * as routesLoader from './utils/routes-loader';
import { createApp } from './create-app';

describe('createApp()', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should create basic express app with root endpoint', async () => {
    const loadRoutesSpy = vi.spyOn(routesLoader, 'loadRoutes');
    loadRoutesSpy.mockResolvedValueOnce([]);

    const app = await createApp();
    app.get('/', (_, res) => res.send('OK'));
    const response = await supertest(app).get('/').expect(200);
    expect(response.text).toBe('OK');
  });

  test('should load routes from directory and register them on express app', async () => {
    const loadRoutesSpy = vi.spyOn(routesLoader, 'loadRoutes');
    loadRoutesSpy.mockResolvedValueOnce([
      {
        method: 'GET',
        path: '/',
        handler(_, res) {
          res.send('OK');
        },
      },
    ]);

    const app = await createApp();
    const response = await supertest(app).get('/').expect(200);
    expect(response.text).toBe('OK');
  });

  test('should append middlewares', async () => {
    const fn = vi.fn();

    const app = await createApp({
      middlewares: [
        (req, res, next) => {
          fn();
          next();
        },
      ],
    });

    app.get('/', (_, res) => res.send('OK'));

    await supertest(app).get('/').expect(200);

    expect(fn).toHaveBeenCalledOnce();
  });

  describe('listen()', () => {
    test('should return OK', async () => {
      const app = await createApp();
      app.get('/', (_, res) => res.send('OK'));
      await app.listen(3000);
      const response = await got('http://localhost:3000');
      expect(response.body).toEqual('OK');
    });
  });
});
