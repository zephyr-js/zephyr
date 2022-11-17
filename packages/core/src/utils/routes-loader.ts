import { ZephyrRoute, ROUTE_METHODS } from '@zephyr-js/common';
import glob from 'glob';
import { normalize, parse, join, dirname, relative, extname } from 'path';
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
  // Get relative file path and optionally convert Windows to Unix-style path
  const rel = relative(dir, file).replaceAll('\\', '/');
  const ext = extname(rel);

  let mappedPath = rel;

  if (mappedPath.endsWith('index.ts')) {
    mappedPath = '/' + mappedPath.replace('index.ts', '');
  } else {
    mappedPath = '/' + rel.replace(ext, '');
  }

  // Convert [params] to :params
  mappedPath = mappedPath.replaceAll('[', ':').replaceAll(']', '');

  // Remove trailing slashes
  if (mappedPath.endsWith('/')) {
    mappedPath = mappedPath.slice(0, mappedPath.length - 1);
  }

  return mappedPath || '/';
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
      const path = extractPath(file, dir);
      const exports: RouteExports = await import(file);

      for (const method of ROUTE_METHODS) {
        const exported = exports[method];

        if (!exported) {
          continue;
        }

        routes.push({
          ...exported,
          path,
          method,
        });
      }
    }),
  );

  return routes;
};
