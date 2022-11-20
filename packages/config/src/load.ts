import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export interface LoadOptions {
  path?: string;
  variables?: object;
  dotenv?: boolean;
}

export function getConfigFilePath(
  env: string = process.env.NODE_ENV || 'development',
): string {
  return `${process.cwd()}/config/${env}.json`;
}

export function load<T extends object>({
  path = getConfigFilePath(),
  variables = {},
  dotenv = true,
}: LoadOptions = {}): T {
  if (!existsSync(path)) {
    throw new Error(`Config file not found at path: '${path}'`);
  }

  // Load .env file
  if (dotenv) {
    require('dotenv').config({
      path: join(path, '..', '..', '.env'),
    });
    variables = {
      ...process.env,
      ...variables,
    };
  }

  // Read config file
  let content = readFileSync(path, 'utf-8');

  // Parse variables
  Object.entries(variables).forEach(([key, value]) => {
    const re = new RegExp('{{(?:\\s+)?(' + key + ')(?:\\s+)?}}', 'g');
    content = content.replace(re, value);
  });

  return JSON.parse(content) as T;
}
