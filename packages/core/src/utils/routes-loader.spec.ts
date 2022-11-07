import path from 'path';
import { describe, expect, test } from 'vitest';
import { extractMethod, extractPath, loadRoutes } from './routes-loader';

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
});

describe('Load routes', () => {
  test('should load routes from test/api directory', async () => {
    const dir = path.join(__dirname, '..', 'test', 'api');
    const routes = await loadRoutes(dir);
    expect(routes).toHaveLength(1);
    const [route] = routes;
    expect(route.method).toBe('GET');
    expect(route.path).toBe('/');
    expect(route.handler).toBeDefined();
  });
});
