import { readFileSync } from 'fs';

export interface LoadOptions {
  path?: string;
  secrets?: object;
}

export function load<T extends object>({
  path = '',
  secrets = process.env,
}: LoadOptions = {}): T {
  let content = readFileSync(path, 'utf-8');

  Object.entries(secrets).forEach(([key, value]) => {
    const re = new RegExp('{{(?:\\s+)?(' + key + ')(?:\\s+)?}}', 'g');
    content = content.replaceAll(re, value);
  });

  return JSON.parse(content) as T;
}
