import path from 'path';
import { describe, expect, test } from 'vitest';
import { extractMethod, extractPath, loadRoutes, pwd } from './routes-loader';

describe('Get working directory', () => {
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

describe('Extract method', () => {
  test('should return GET', () => {
    const file = '/Users/user/project/src/api/v1/items/get.ts';
    const method = extractMethod(file);
    expect(method).toEqual('GET');
  });

  test('should throw invalid HTTP method error', () => {
    const file = '/Users/user/project/src/api/v1/items/invalid.ts';
    expect(() => extractMethod(file)).throws('HTTP method is invalid');
  });
});

describe('Extract path', () => {
  test('should extract path', () => {
    const file = '/Users/user/project/src/api/v1/items/get.ts';
    const path = extractPath(file, '/Users/user/project/src/api');
    expect(path).toEqual('/v1/items');
  });

  test('should format dynamic routes', () => {
    const file = '/Users/user/project/src/api/v1/items/[itemId]/get.ts';
    const path = extractPath(file, '/Users/user/project/src/api');
    expect(path).toEqual('/v1/items/:itemId');
  });
});

describe('Load routes', () => {
  test('should load routes from test/api directory', async () => {
    const dir = path.join(__dirname, '..', 'mocks', 'app', 'api');
    const routes = await loadRoutes(dir);
    expect(routes).toHaveLength(1);
    const [route] = routes;
    expect(route.method).toBe('GET');
    expect(route.path).toBe('/');
    expect(route.handler).toBeDefined();
  });
});
