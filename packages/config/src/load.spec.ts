import { afterEach, describe, expect, test } from 'vitest';
import path from 'path';
import { getConfigFilePath, load } from './load';

describe('load()', () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = env;
  });

  test('should load config from file', () => {
    const config = load({
      path: path.join(__dirname, '__mocks__', 'config', 'basic.json'),
    });
    expect(config).to.deep.equals({ port: 3000 });
  });

  test('should load config from file and parse specific variables', () => {
    const config = load({
      path: path.join(__dirname, '__mocks__', 'config', 'variables.json'),
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
      path: path.join(__dirname, '__mocks__', 'config', 'env.json'),
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
      path: path.join(__dirname, '__mocks__', 'config', 'dotenv.json'),
      dotenv: true,
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
    expect(getConfigFilePath()).toEqual(
      path.join(__dirname, '..', 'config', 'test.json'),
    );
  });

  test('should return correct config file path with default environment (development)', () => {
    process.env.NODE_ENV = undefined;
    expect(getConfigFilePath()).toEqual(
      path.join(__dirname, '..', 'config', 'development.json'),
    );
  });
});
