import { ZephyrRoute, ROUTE_METHODS, ZephyrHandler } from '@zephyr-js/common';
import glob from 'glob';
import { normalize, parse, join, dirname } from 'path';

const pwd = () => {
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

export const extractPath = (file: string) => {
  const path = file
    .split('/')
    .slice(0, -1)
    .join('/')
    .replace(srcDir() + '/api', '');

  return path || '/';
};

export const loadRoutes = (): ZephyrRoute[] => {
  const pattern = apiDir() + '/**/{get,post,put,delete,patch,head}.ts';

  const files = glob.sync(normalize(pattern));

  return files.map((file) => {
    const route: Omit<ZephyrRoute, 'method' | 'path'> & {
      default?: ZephyrHandler;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
    } = require(file);
    const handler = route.default || route.handler;
    return {
      ...route,
      handler,
      method: extractMethod(file),
      path: extractPath(file),
      before: route.before || [],
      after: route.after || [],
    };
  });
};
