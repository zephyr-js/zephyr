import path from 'path';
import supertest from 'supertest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { z } from 'zod';
import * as routesLoader from './utils/routes-loader';
import { zephyr } from './zephyr';

describe('Zephyr', () => {
  beforeEach(() => {
    console.log('Hi');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should create basic express app with root endpoint', async () => {
    const loadRoutesSpy = vi.spyOn(routesLoader, 'loadRoutes');
    loadRoutesSpy.mockResolvedValueOnce([]);

    const app = await zephyr();
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
        handler: async (_, res) => res.send('OK'),
        schema: z.object({
          params: z.object({}).optional(),
          body: z.object({}).optional(),
          query: z.object({}).optional(),
        }),
      },
    ]);

    const app = await zephyr();
    const response = await supertest(app).get('/').expect(200);
    expect(response.text).toBe('OK');
  });
});
