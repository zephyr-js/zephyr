import { ZephyrRoute, ROUTE_METHODS } from '@zephyr-js/common';
import glob from 'glob';
import { normalize, win32, join, parse, posix } from 'path';
import { DefineRouteOptions } from '../define-route';

export function extractPath(file: string, dir: string) {
  let path = file.replace(dir, '');

  // Convert Windows path to Unix path
  path = path.replaceAll(win32.sep, posix.sep);

  const parsed = parse(path);

  // Handle index path
  path = parsed.dir;
  if (parsed.name !== 'index') {
    path += (parsed.dir === '/' ? '' : '/') + parsed.name;
  }

  // Handle dynamic path
  path = path.replaceAll('[', ':').replaceAll(']', '');

  return path;
}

type RouteExports = {
  [key: string]: (deps: object) => DefineRouteOptions;
};

interface LoadRoutesOptions {
  dir?: string;
  dependencies?: object;
}

export async function loadRoutes({
  dir = join(process.cwd(), 'src', 'routes'),
  dependencies = {},
}: LoadRoutesOptions = {}): Promise<ZephyrRoute[]> {
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

        if (!exported || typeof exported !== 'function') {
          continue;
        }

        routes.push({
          ...exported(dependencies),
          path: extractPath(file, dir),
          method,
        });
      }
    }),
  );

  return routes;
}
