import { describe, expect, test } from 'vitest';
import { isConstructorToken, normalizeToken } from './injection-token';

describe('isConstructorToken()', () => {
  test('should return true if a constructor is passed', () => {
    class Service {}
    const entries = [Number, String, Service];

    for (const entry of entries) {
      expect(isConstructorToken(entry)).toBe(true);
    }
  });

  test('should return false if a non constructor is passed', () => {
    const entries = ['service', 1, true];

    for (const entry of entries) {
      expect(isConstructorToken(entry)).toBe(false);
    }
  });
});

describe('normalizeToken()', () => {
  test('should return constructor name if constructor is passed', () => {
    class Service {}

    const entries = [
      { constructor: Number, name: 'Number' },
      { constructor: String, name: 'String' },
      { constructor: Service, name: 'Service' },
    ];

    for (const entry of entries) {
      expect(normalizeToken(entry.constructor)).toBe(entry.name);
    }
  });

  test('should return toString() value if non constructor is passed', () => {
    const entries = [{ constructor: 'foo', name: 'foo' }];

    for (const entry of entries) {
      expect(normalizeToken(entry.constructor)).toBe(entry.name);
    }
  });
});
