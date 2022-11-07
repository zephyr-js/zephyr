import { ZephyrRoute, ROUTE_METHODS, ZephyrHandler } from '@zephyr-js/common';
import glob from 'glob';
import { normalize, parse, join, dirname } from 'path';

export const pwd = () => {
  const main = require.main;
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
  const path = file.split('/').slice(0, -1).join('/').replace(dir, '');
  return path || '/';
};

export const loadRoutes = async (dir = apiDir()): Promise<ZephyrRoute[]> => {
  const pattern = dir + '/**/{get,post,put,delete,patch,head}.ts';

  const files = glob.sync(normalize(pattern));

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
