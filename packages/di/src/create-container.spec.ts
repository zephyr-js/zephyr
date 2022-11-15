import { describe, expect, test } from 'vitest';
import { createContainer } from './create-container';

describe('createContainer()', () => {
  describe('registerSingleton()', () => {
    test('should register a dependency', () => {
      type Dependencies = {
        a: string;
      };

      const container = createContainer<Dependencies>();
      container.registerSingleton('a', 'foo');
      expect(container.isRegistered('a')).to.be.true;
    });
  });

  describe('registerLazySingleton()', () => {
    test('should register a lazy dependency', () => {
      type Dependencies = {
        a: string;
      };

      const container = createContainer<Dependencies>();
      container.registerLazySingleton('a', () => 'foo');
      expect(container.isRegistered('a')).to.be.true;
    });
  });

  describe('registerSingletonAsync()', () => {
    test('should register an async dependency', () => {
      type Dependencies = {
        a: string;
      };

      const container = createContainer<Dependencies>();
      container.registerSingletonAsync('a', async () => 'foo');
      expect(container.isRegistered('a')).to.be.true;
    });
  });

  describe('isRegistered()', () => {
    test('should return true', () => {
      type Dependencies = {
        a: string;
      };

      const container = createContainer<Dependencies>();
      container.registerSingleton('a', 'foo');

      expect(container.isRegistered('a')).to.be.true;
    });

    test('should return false', () => {
      type Dependencies = {
        a: string;
        b: number;
      };

      const container = createContainer<Dependencies>();
      container.registerSingleton('a', 'foo');

      expect(container.isRegistered('b')).to.be.false;
    });
  });

  describe('unregister()', () => {
    test('should unregister dependency', () => {
      type Dependencies = {
        a: string;
      };

      const container = createContainer<Dependencies>();
      container.registerSingleton('a', 'foo');
      expect(container.isRegistered('a')).to.be.true;

      container.unregister('a');
      expect(container.isRegistered('a')).to.be.false;
    });
  });

  describe('resetLazySingleton()', () => {
    test('should reset an existing lazy singleton', () => {
      type Dependencies = {
        a: string;
      };

      const container = createContainer<Dependencies>();
      container.registerLazySingleton('a', () => 'foo');
      container.resetLazySingleton('a', () => 'bar');
      expect(container.resolve('a')).to.equals('bar');
    });
  });

  describe('reset()', () => {
    test('should reset all dependencies', () => {
      type Dependencies = {
        a: string;
        b: number;
      };

      const container = createContainer<Dependencies>();
      container.registerSingleton('a', 'bar');
      container.registerLazySingleton('b', () => 1);
      container.reset();

      expect(container.isRegistered('a')).to.be.false;
      expect(container.isRegistered('b')).to.be.false;
    });
  });

  describe('resolve()', () => {
    test('should resolve registered dependency', () => {
      type Dependencies = {
        a: string;
      };

      const container = createContainer<Dependencies>();
      container.registerSingleton('a', 'foo');

      expect(container.resolve('a')).toEqual('foo');
    });

    test('should resolve lazy registered dependency', () => {
      type Dependencies = {
        a: string;
      };

      const container = createContainer<Dependencies>();
      container.registerLazySingleton('a', () => 'foo');

      expect(container.resolve('a')).toEqual('foo');
    });

    test('should throw error when resolving an unregistered dependency', () => {
      type Dependencies = {
        a: string;
      };

      const container = createContainer<Dependencies>();
      expect(() => container.resolve('a')).to.throw(
        'Dependency \'a\' is not registered',
      );
    });

    test('should throw error when resolving an async factory', () => {
      type Dependencies = {
        a: string;
      };

      const container = createContainer<Dependencies>();
      container.registerSingletonAsync('a', async () => 'foo');
      expect(() => container.resolve('a')).to.throw(
        'Factory function for dependency \'a\' is asynchronous, please use \'resolveAsync()\' instead',
      );
    });
  });

  describe('resolveAsync()', () => {
    test('should resolve registered async dependency', async () => {
      type Dependencies = {
        a: string;
      };

      const container = createContainer<Dependencies>();
      container.registerSingletonAsync('a', async () => 'foo');

      expect(await container.resolveAsync('a')).toEqual('foo');
    });

    test('should throw error when resolving an unregistered dependency', async () => {
      type Dependencies = {
        a: string;
      };

      const container = createContainer<Dependencies>();

      await expect(() => container.resolveAsync('a')).rejects.toThrow(
        'Dependency \'a\' is not registered',
      );
    });

    test('should throw error when resolving a sync factory', async () => {
      type Dependencies = {
        a: string;
      };

      const container = createContainer<Dependencies>();
      container.registerLazySingleton('a', () => 'foo');
      await expect(() => container.resolveAsync('a')).rejects.toThrow(
        'Factory function for dependency \'a\' is synchronous, please use \'resolve()\' instead',
      );
    });
  });
});
