import fs from 'fs';
import { AnyZodObject } from 'zod';
import yaml from 'yaml';
import dotenv from 'dotenv';
import * as eta from 'eta';
import path from 'path';

export interface LoadOptions {
  path?: string | null;
  variables?: object;
  schema?: AnyZodObject;
}

export function getConfigFilePath(
  env: string = process.env.NODE_ENV || 'development',
): string | null {
  const file = path.join(process.cwd(), 'config', env);
  const extensions = ['.yml', '.yaml'];

  for (const extension of extensions) {
    if (fs.existsSync(file + extension)) {
      return file + extension;
    }
  }

  return null;
}

export function getEnvFilePath(): string {
  return path.join(process.cwd(), '.env');
}

export function parseVariables(template: string, variables: object): string {
  return eta.render(template, variables, { autoTrim: false }) as string;
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
  schema,
}: LoadOptions = {}): T {
  if (path === null || !fs.existsSync(path)) {
    throw new Error(`Config file not found at path: '${path}'`);
  }

  dotenv.config();

  const template = fs.readFileSync(path, 'utf-8');
  const content = parseVariables(template, variables);

  const config = yaml.parse(content);

  if (schema) {
    validateConfig(schema, config);
  }

  return config as T;
}
