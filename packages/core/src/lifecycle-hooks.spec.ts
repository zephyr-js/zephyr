import supertest from 'supertest';
import { expect, test, vi } from 'vitest';
import { z } from 'zod';
import { createApp } from './create-app';
import * as routesLoader from './utils/routes-loader';

test('should call `onRequest` hook', async () => {
  const onRequestMock = vi.fn();

  const loadRoutesSpy = vi.spyOn(routesLoader, 'loadRoutes');
  loadRoutesSpy.mockResolvedValueOnce([
    {
      method: 'GET',
      path: '/',
      onRequest: onRequestMock,
      handler(_, res) {
        res.send('OK');
      },
    },
  ]);

  const app = await createApp();
  await supertest(app).get('/').expect(200);
  expect(onRequestMock).toHaveBeenCalledOnce();
});

test('should call `onBeforeValidate` hook', async () => {
  const onBeforeValidateMock = vi.fn();

  const loadRoutesSpy = vi.spyOn(routesLoader, 'loadRoutes');
  loadRoutesSpy.mockResolvedValueOnce([
    {
      method: 'GET',
      path: '/',
      onBeforeValidate: onBeforeValidateMock,
      schema: z.object({}),
      handler(_, res) {
        res.send('OK');
      },
    },
  ]);

  const app = await createApp();
  await supertest(app).get('/').expect(200);
  expect(onBeforeValidateMock).toHaveBeenCalledOnce();
});

test('should call `onBeforeHandle` hook', async () => {
  const onBeforeHandleMock = vi.fn();

  const loadRoutesSpy = vi.spyOn(routesLoader, 'loadRoutes');
  loadRoutesSpy.mockResolvedValueOnce([
    {
      method: 'GET',
      path: '/',
      onBeforeHandle: onBeforeHandleMock,
      handler(_, res) {
        res.send('OK');
      },
    },
  ]);

  const app = await createApp();
  await supertest(app).get('/').expect(200);
  expect(onBeforeHandleMock).toHaveBeenCalledOnce();
});

test('should call `onErrorCaptured` hook', async () => {
  const onErrorCapturedMock = vi.fn().mockImplementation((_, res) => {
    return res.status(500).send('Something went wrong');
  });

  const loadRoutesSpy = vi.spyOn(routesLoader, 'loadRoutes');
  loadRoutesSpy.mockResolvedValueOnce([
    {
      method: 'GET',
      path: '/',
      onErrorCaptured: onErrorCapturedMock,
      handler() {
        throw new Error('Something went wrong');
      },
    },
  ]);

  const app = await createApp();
  await supertest(app).get('/').expect(500);
  expect(onErrorCapturedMock).toHaveBeenCalledOnce();
});

test('should call `onResponse` hook', async () => {
  const onResponseMock = vi.fn();

  const loadRoutesSpy = vi.spyOn(routesLoader, 'loadRoutes');
  loadRoutesSpy.mockResolvedValueOnce([
    {
      method: 'GET',
      path: '/',
      onResponse: onResponseMock,
      handler(_, res) {
        res.send('OK');
      },
    },
  ]);

  const app = await createApp();
  await supertest(app).get('/').expect(200);
  expect(onResponseMock).toHaveBeenCalledOnce();
});
