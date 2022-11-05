import { ZephyrRoute, ROUTE_METHODS } from '@zephyrjs/common';
import glob from 'glob';
import { normalize, parse, join } from 'path';

export const extractMethod = (file: string) => {
  const method = parse(file).name.toUpperCase() as ZephyrRoute['method'];
  if (!ROUTE_METHODS.includes(method)) {
    throw new Error('HTTP method is invalid');
  }
  return method;
};

export const extractPath = (file: string) => {
  file = file.split('/').slice(0, -1).join('/');
  const index = file.indexOf('/api/');
  const ext = parse(file).ext;
  return file.substring(index + 4, file.length).replace(ext, '');
};

export const loadRoutes = (): ZephyrRoute[] => {
  const rootDir = join(__dirname, '..', '..', '..', 'src');
  const apiDir = rootDir + '/api';
  const pattern = apiDir + '/**/{get,post,put,delete,patch,head}.ts';

  const files = glob.sync(normalize(pattern));

  return files.map((file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const route: Omit<ZephyrRoute, 'method' | 'path'> = require(file);
    return {
      ...route,
      method: extractMethod(file),
      path: extractPath(file),
      before: route.before || [],
      after: route.after || [],
    };
  });
};
