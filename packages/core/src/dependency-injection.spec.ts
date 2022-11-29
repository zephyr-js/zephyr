import supertest from 'supertest';
import { expect, test, vi } from 'vitest';
import { createApp } from './create-app';
import * as routesLoader from './utils/routes-loader';
import { Calculator } from './__mocks__/app/services/calculator';
import * as routes from './__mocks__/app/routes/sum';
import { json } from 'express';

test('should able to inject dependencies on route handler', async () => {
  const dependencies = {
    calculator: new Calculator(),
  };

  const loadRoutesSpy = vi.spyOn(routesLoader, 'loadRoutes');
  loadRoutesSpy.mockResolvedValueOnce([
    {
      ...routes.POST(dependencies),
      method: 'POST',
      path: '/sum',
    },
  ]);

  const app = await createApp({
    middlewares: [json()],
  });

  const response = await supertest(app)
    .post('/sum')
    .send({ x: 1, y: 2 })
    .expect(200);

  expect(response.text).to.equal('3');
});
