import { provide } from '@zephyr-js/di';
import supertest from 'supertest';
import { expect, test, vi } from 'vitest';
import { createApp } from './create-app';
import { DefineRouteOptions } from './define-route';
import * as routesLoader from './utils/routes-loader';
import { INJECTION_KEYS } from './__mocks__/app/di';

test('should able to inject dependencies on route handler', async () => {
  provide(INJECTION_KEYS.CALCULATOR, {
    sum: (x, y) => x + y,
  });

  const routes = await import('./__mocks__/app/routes/sum');

  const loadRoutesSpy = vi.spyOn(routesLoader, 'loadRoutes');
  loadRoutesSpy.mockResolvedValueOnce([
    {
      ...(routes.POST as DefineRouteOptions),
      method: 'POST',
      path: '/sum',
    },
  ]);

  const app = await createApp();

  const response = await supertest(app)
    .post('/sum')
    .send({ x: 1, y: 2 })
    .expect(200);

  expect(response.text).to.equal('3');
});
