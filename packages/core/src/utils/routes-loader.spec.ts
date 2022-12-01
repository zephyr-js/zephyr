import path from 'path';
import { describe, expect, test } from 'vitest';
import { extractPath, loadRoutes } from './routes-loader';

describe('extractPath()', () => {
  test('should extract path', () => {
    const file = '/Users/user/project/src/routes/v1/todos.ts';
    const path = extractPath(file, '/Users/user/project/src/routes');
    expect(path).toEqual('/v1/todos');
  });

  test('should extract index path', () => {
    const file = '/Users/user/project/src/routes/v1/todos/index.ts';
    const path = extractPath(file, '/Users/user/project/src/routes');
    expect(path).toEqual('/v1/todos');
  });

  test('should format dynamic routes', () => {
    const file = '/Users/user/project/src/routes/v1/items/[itemId].ts';
    const path = extractPath(file, '/Users/user/project/src/routes');
    expect(path).toEqual('/v1/items/:itemId');
  });
});

describe('loadRoutes()', () => {
  test('should load routes from __mocks__/app/routes directory', async () => {
    const dir = path.join(__dirname, '..', '__mocks__', 'app', 'routes');
    const routes = await loadRoutes({ dir });

    const routeAssertions = [
      { method: 'GET', path: '/:id' },
      { method: 'POST', path: '/sum' },
      { method: 'GET', path: '/todos' },
      { method: 'POST', path: '/todos' },
      { method: 'GET', path: '/v1' },
      { method: 'GET', path: '/v1/todos' },
      { method: 'POST', path: '/v1/todos' },
      { method: 'GET', path: '/v1/:id' },
      { method: 'GET', path: '/' },
      { method: 'GET', path: '/items/:itemId' },
    ];

    expect(routes).toHaveLength(routeAssertions.length);

    for (const { method, path } of routeAssertions) {
      expect(
        routes.some((route) => {
          return route.method === method && route.path === path;
        }),
      ).to.be.true;
    }
  });
});
