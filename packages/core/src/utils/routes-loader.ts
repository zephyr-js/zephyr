import { ZephyrRoute, ROUTE_METHODS } from '@zephyr-js/common';
import glob from 'glob';
import { normalize, parse, join, dirname } from 'path';
import { DefineRouteOptions } from '../define-route';

export const pwd = (main = require.main) => {
  if (!main) {
    throw new Error('`main` not found');
  }
  return dirname(main.filename);
};

const srcDir = () => join(pwd(), '..', 'src');
const routesDir = () => join(srcDir(), 'routes');

export const extractMethod = (file: string) => {
  const method = parse(file).name.toUpperCase() as ZephyrRoute['method'];
  if (!ROUTE_METHODS.includes(method)) {
    throw new Error('HTTP method is invalid');
  }
  return method;
};

export const extractPath = (file: string, dir: string) => {
  file = file.replace(dir, '');

  const { ext, name, base } = parse(file);

  if (name === 'index') {
    file = file.replace('/' + base, '');
  } else {
    file = file.replace(ext, '');
  }

  file = file.replaceAll('[', ':').replaceAll(']', '');

  return file || '/';
};

type RouteExports = {
  [key: string]: DefineRouteOptions;
};

export const loadRoutes = async (dir = routesDir()): Promise<ZephyrRoute[]> => {
  const pattern = '**/*.ts';

  const files = glob
    .sync(pattern, {
      cwd: dir,
      absolute: true,
    })
    .map(normalize);

  const routes: ZephyrRoute[] = [];

  await Promise.all(
    files.map(async (file) => {
      const exports: RouteExports = await import(file);

      for (const method of ROUTE_METHODS) {
        const exported = exports[method];

        if (!exported) {
          continue;
        }

        routes.push({
          ...exported,
          path: extractPath(file, dir),
          method,
        });
      }
    }),
  );

  return routes;
};
