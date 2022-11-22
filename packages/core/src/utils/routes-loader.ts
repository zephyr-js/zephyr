import { ZephyrRoute, ROUTE_METHODS } from '@zephyr-js/common';
import glob from 'glob';
import { normalize, relative, extname, join } from 'path';
import { DefineRouteOptions } from '../define-route';

export function extractPath(file: string, dir: string) {
  // Convert Windows to Unix path
  file = file.replace(new RegExp('\\\\', 'g'), '/');
  dir = dir.replace(new RegExp('\\\\', 'g'), '/');

  // Get relative file path
  let path = relative(dir, file);

  // Handle index path
  path = path.replace(new RegExp('index.ts' + '$'), '');

  // Remove file extension
  path = path.replace(new RegExp(extname(path) + '$'), '');

  // Convert [params] to :params
  path = path.replaceAll('[', ':').replaceAll(']', '');

  // Remove trailing slashes
  path = path.replace(/\/+$/, '');

  // Add leading slash
  path = '/' + path;

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
