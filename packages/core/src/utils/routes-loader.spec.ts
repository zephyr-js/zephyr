import path from 'path';
import { describe, expect, test } from 'vitest';
import { extractMethod, extractPath, loadRoutes, pwd } from './routes-loader';

describe('pwd()', () => {
  test('should return directory based on main.filename', () => {
    const main = {
      filename:
        '/Users/user/project/node_modules/@zephyr-js/core/utils/routes-loader.ts',
    } as NodeJS.Module;
    expect(pwd(main)).toEqual(
      '/Users/user/project/node_modules/@zephyr-js/core/utils',
    );
  });

  test('should throw error if main not found', () => {
    expect(() => pwd()).throws('`main` not found');
  });
});

describe('extractMethod()', () => {
  test('should return GET', () => {
    const file = '/Users/user/project/src/routes/v1/items/get.ts';
    const method = extractMethod(file);
    expect(method).toEqual('GET');
  });

  test('should throw invalid HTTP method error', () => {
    const file = '/Users/user/project/src/routes/v1/items/invalid.ts';
    expect(() => extractMethod(file)).throws('HTTP method is invalid');
  });
});

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

  test('should format Windows routes', () => {
    const file =
      'C:\\Users\\user\\project\\src\\routes\\v1\\items\\[itemId].ts';
    const path = extractPath(file, 'C:\\Users\\user\\project\\src\\routes');
    expect(path).toEqual('/v1/items/:itemId');
  });

  test('should format weird mixed file paths', () => {
    const file = 'C:\\Users\\user\\project/src\\routes\\v1\\items/[itemId].ts';
    const path = extractPath(file, 'C:\\Users\\user\\project\\src\\routes');
    expect(path).toEqual('/v1/items/:itemId');
  });
});

describe('loadRoutes()', () => {
  test('should load routes from __mocks__/app/routes directory', async () => {
    const dir = path.join(__dirname, '..', '__mocks__', 'app', 'routes');
    const routes = await loadRoutes(dir);
    expect(routes).toHaveLength(8);

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
        return route.method === 'GET' && route.path === '/v1';
      }),
    ).to.be.true;

    expect(
      routes.some((route) => {
        return route.method === 'GET' && route.path === '/v1/todos';
      }),
    ).to.be.true;

    expect(
      routes.some((route) => {
        return route.method === 'POST' && route.path === '/v1/todos';
      }),
    ).to.be.true;

    expect(
      routes.some((route) => {
        return route.method === 'GET' && route.path === '/:id';
      }),
    ).to.be.true;

    expect(
      routes.some((route) => {
        return route.method === 'GET' && route.path === '/v1/:id';
      }),
    ).to.be.true;
  });
});
