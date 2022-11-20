import { existsSync, readFileSync } from 'fs';
import { AnyZodObject } from 'zod';

export interface LoadOptions {
  path?: string;
  variables?: object;
  dotenv?: boolean;
  schema?: AnyZodObject;
}

export function getConfigFilePath(
  env: string = process.env.NODE_ENV || 'development',
): string {
  return `${process.cwd()}/config/${env}.json`;
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
  if (!existsSync(path)) {
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

  const content = parseVariables(readFileSync(path, 'utf-8'), variables);

  const config = JSON.parse(content);

  if (schema) {
    validateConfig(schema, config);
  }

  return config as T;
}
