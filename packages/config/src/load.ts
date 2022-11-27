import fs from 'fs';
import { AnyZodObject } from 'zod';
import yaml from 'yaml';

export interface LoadOptions {
  path?: string | null;
  variables?: object;
  dotenv?: boolean;
  schema?: AnyZodObject;
}

export function getConfigFilePath(
  env: string = process.env.NODE_ENV || 'development',
): string | null {
  const file = `${process.cwd()}/config/${env}`;
  const extensions = ['.yml', '.yaml', '.json'];

  for (const extension of extensions) {
    if (fs.existsSync(file + extension)) {
      return file + extension;
    }
  }

  return null;
}

export function getEnvFilePath(): string {
  return `${process.cwd()}/.env`;
}

export function parseVariables(content: string, variables: object): string {
  return Object.keys(variables).reduce((acc: string, curr) => {
    const re = new RegExp('{{(?:\\s+)?(' + curr + ')(?:\\s+)?}}', 'g');
    const value = variables[curr as keyof typeof variables];
    return acc.replace(re, value);
  }, content);
}

export function validateConfig(schema: AnyZodObject, config: unknown): void {
  const validation = schema.safeParse(config);
  if (!validation.success) {
    const message = validation.error.issues.reduce((acc: string, issue) => {
      acc += `\`${issue.path}\`: ${issue.message}`;
      return acc;
    }, 'Config validation error:\n');
    throw new Error(message);
  }
}

export function load<T extends object>({
  path = getConfigFilePath(),
  variables = {},
  dotenv = true,
  schema,
}: LoadOptions = {}): T {
  if (path === null || !fs.existsSync(path)) {
    throw new Error(`Config file not found at path: '${path}'`);
  }

  if (dotenv) {
    require('dotenv').config({
      path: getEnvFilePath(),
    });
    variables = {
      ...process.env,
      ...variables,
    };
  }

  const content = parseVariables(fs.readFileSync(path, 'utf-8'), variables);

  const config = path.endsWith('.json')
    ? JSON.parse(content)
    : yaml.parse(content);

  if (schema) {
    validateConfig(schema, config);
  }

  return config as T;
}
