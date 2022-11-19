import { describe, expect, test } from 'vitest';
import path from 'path';
import { load } from './load';

describe('load()', () => {
  test('should load basic config from file', () => {
    const config = load({
      path: path.join(__dirname, '__mocks__', 'basic.json'),
    });
    expect(config).to.deep.equals({ port: 3000 });
  });

  test('should load config and parse secrets from file ', () => {
    process.env.JWT_SECRET = 'jwt-secret';
    process.env.DB_PASS = 'db-pass';

    const config = load({
      path: path.join(__dirname, '__mocks__', 'env.json'),
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
});
