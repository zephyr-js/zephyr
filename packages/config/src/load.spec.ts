import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import path from 'path';
import fs from 'fs';
import {
  getConfigFilePath,
  getEnvFilePath,
  load,
  parseVariables,
  validateConfig,
} from './load';
import { z } from 'zod';

describe('parseVariables()', () => {
  test('should return parsed content', () => {
    const content = parseVariables(
      'Hello <%= it.message %> <%= it.message %>',
      {
        message: 'world',
      },
    );
    expect(content).toEqual('Hello world world');
  });
});

describe('validateConfig()', () => {
  test('should return void when validation is success', () => {
    const schema = z.object({
      port: z.number(),
    });

    const config = {
      port: 3000,
    };

    expect(validateConfig(schema, config)).toBeUndefined;
  });

  test('should throw error when validation fails', () => {
    const schema = z.object({
      port: z.number(),
    });

    const config = {
      port: '3000',
    };

    expect(() => validateConfig(schema, config)).toThrow(
      'Config validation error:\n`port`: Expected number, received string',
    );
  });
});

describe('load()', () => {
  const env = { ...process.env };

  beforeAll(() => {
    vi.spyOn(process, 'cwd').mockReturnValue(
      path.join(__dirname, '__mocks__', 'app'),
    );
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = env;
  });

  test('should load config from file', () => {
    const config = load({
      path: path.join(__dirname, '__mocks__', 'app', 'config', 'basic.yml'),
    });
    expect(config).to.deep.equals({ port: 3000 });
  });

  test('should load config from file and parse specific variables', () => {
    const config = load({
      path: path.join(__dirname, '__mocks__', 'app', 'config', 'variables.yml'),
      variables: {
        AWS_ACCESS_KEY_ID: '123',
        AWS_SECRET_ACCESS_KEY: '456',
      },
    });
    expect(config).to.deep.equals({
      aws: {
        accessKeyId: '123',
        secretAccessKey: '456',
      },
    });
  });

  test('should load config from file and parse variables from process.env', () => {
    process.env.JWT_SECRET = 'jwt-secret';
    process.env.DB_PASS = 'db-pass';

    const config = load({
      path: path.join(__dirname, '__mocks__', 'app', 'config', 'env.yml'),
    });

    expect(config).to.deep.equals({
      jwt: {
        secret: 'jwt-secret',
      },
      database: {
        username: 'root',
        password: 'db-pass',
      },
    });

    delete process.env.JWT_SECRET;
    delete process.env.DB_PASS;
  });

  test('should load config from file and parse variables from .env file', () => {
    const config = load({
      path: path.join(__dirname, '__mocks__', 'app', 'config', 'env.yml'),
    });

    expect(config).to.deep.equals({
      jwt: {
        secret: '123',
      },
      database: {
        username: 'root',
        password: '456',
      },
    });
  });

  test('should throw error when config file not exists', () => {
    expect(() => load({ path: 'foo' })).toThrow(
      'Config file not found at path: \'foo\'',
    );
  });

  test('should throw error when config file not exists (default)', () => {
    expect(() => load()).toThrow('Config file not found at path: \'null\'');
  });

  test('should load config from file and validate it', () => {
    const config = load({
      path: path.join(__dirname, '__mocks__', 'app', 'config', 'variables.yml'),
      variables: {
        AWS_ACCESS_KEY_ID: '123',
        AWS_SECRET_ACCESS_KEY: '456',
      },
      schema: z.object({
        aws: z.object({
          accessKeyId: z.string(),
          secretAccessKey: z.string(),
        }),
      }),
    });
    expect(config).to.deep.equals({
      aws: {
        accessKeyId: '123',
        secretAccessKey: '456',
      },
    });
  });
});

describe('getConfigFilePath()', () => {
  test('should return correct config file path with current environment (test)', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValueOnce(true);

    expect(getConfigFilePath()).toEqual(
      path.join(__dirname, '..', 'config', 'test.yml'),
    );
  });

  test('should return null', () => {
    process.env.NODE_ENV = undefined;
    expect(getConfigFilePath()).toBeNull();
  });

  test('should return correct config file path', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValueOnce(true);

    expect(getConfigFilePath()).toEqual(
      path.join(__dirname, '..', 'config', 'development.yml'),
    );
  });
});

describe('getEnvFilePath()', () => {
  test('should return correct .env file path', () => {
    vi.spyOn(process, 'cwd').mockReturnValue(
      path.join(__dirname, '__mocks__', 'app'),
    );

    expect(getEnvFilePath()).toEqual(
      path.join(__dirname, '__mocks__', 'app', '.env'),
    );

    vi.restoreAllMocks();
  });
});
