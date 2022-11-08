import { ZephyrRoute, ROUTE_METHODS, ZephyrHandler } from '@zephyr-js/common';
import glob from 'glob';
import { normalize, parse, join, dirname } from 'path';

export const pwd = (main = require.main) => {
  if (!main) {
    throw new Error('`main` not found');
  }
  return dirname(main.filename);
};

const srcDir = () => join(pwd(), '..', 'src');
const apiDir = () => join(srcDir(), 'api');

export const extractMethod = (file: string) => {
  const method = parse(file).name.toUpperCase() as ZephyrRoute['method'];
  if (!ROUTE_METHODS.includes(method)) {
    throw new Error('HTTP method is invalid');
  }
  return method;
};

export const extractPath = (file: string, dir: string) => {
  return (
    file
      // Remove directory prefix
      .split('/')
      .slice(0, -1)
      .join('/')
      .replace(dir, '')
      // Convert [param] to :param for dynamic routes
      .replaceAll('[', ':')
      .replaceAll(']', '') || '/'
  );
};

export const loadRoutes = async (dir = apiDir()): Promise<ZephyrRoute[]> => {
  const pattern = '**/{get,post,put,delete,patch}.ts';
  const files = glob
    .sync(pattern, {
      cwd: dir,
      absolute: true,
    })
    .map(normalize);

  return Promise.all(
    files.map(async (file) => {
      const route: Omit<ZephyrRoute, 'method' | 'path'> & {
        default?: ZephyrHandler;
      } = await import(file);
      const handler = route.default || route.handler;
      return {
        ...route,
        handler,
        method: extractMethod(file),
        path: extractPath(file, dir),
        before: route.before || [],
        after: route.after || [],
      };
    }),
  );
};
