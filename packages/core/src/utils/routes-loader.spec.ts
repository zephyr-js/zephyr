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
    expect(routes).toHaveLength(4);

    expect(
      routes.some((route) => {
        return route.method === 'GET' && route.path === '/';
      }),
    ).to.be.true;

    expect(
      routes.some((route) => {
        return route.method === 'GET' && route.path === '/todos';
      }),
    ).to.be.true;

    expect(
      routes.some((route) => {
        return route.method === 'POST' && route.path === '/todos';
      }),
    ).to.be.true;

    expect(
      routes.some((route) => {
        return route.method === 'POST' && route.path === '/sum';
      }),
    ).to.be.true;
  });
});
