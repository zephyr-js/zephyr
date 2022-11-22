import constructor from './types/constructor';
import { isFunction } from './utils/is-function';
import { normalizeToken } from './utils/token';

type Dependency<T> =
  | {
      isLazy: false;
      instance: T;
    }
  | {
      isLazy: true;
      isAsync: false;
      instance: T | null;
      factory: () => T;
    }
  | {
      isLazy: true;
      isAsync: true;
      instance: T | null;
      factory: () => Promise<T>;
    };

export function createContainer() {
  const registry = new Map<
    constructor<any> | string | symbol,
    Dependency<unknown>
  >();

  /**
   * Provide a dependency
   * @param token A unique injection token
   * @param instance An instance of the dependency
   */
  function provide<T>(token: constructor<T> | string | symbol, instance: T) {
    const key = normalizeToken(token);

    registry.set(key, {
      isLazy: false,
      instance,
    });
  }

  /**
   * Provide a dependency lazily, the factory will be run only on the first inject
   * @param token A unique injection token
   * @param factory A factory function that resolves the instance
   */
  function provideLazy<T>(
    token: constructor<T> | string | symbol,
    factory: () => T,
  ) {
    const key = normalizeToken(token);

    registry.set(key, {
      isLazy: true,
      isAsync: false,
      instance: null,
      factory,
    });
  }

  /**
   * Provide a dependency with async factory, the factory will be run only on the first inject
   * @param token A unique injection token
   * @param factory An async factory function that resolves the instance
   */
  function provideAsync<T>(
    token: constructor<T> | string | symbol,
    factory: () => Promise<T>,
  ) {
    const key = normalizeToken(token);

    registry.set(key, {
      isLazy: true,
      isAsync: true,
      instance: null,
      factory,
    });
  }

  /**
   * Inject a dependency with the specified key
   * @param token A unique injection token
   * @param defaultValue A default value that will be returned if dependency is not provided
   * @returns Instance of the dependency
   */
  function inject<T = any>(
    token: constructor<T> | string | symbol,
    defaultValue?: T | (() => T),
  ): T {
    const key = normalizeToken(token);

    if (!registry.has(key)) {
      if (defaultValue) {
        return isFunction(defaultValue) ? defaultValue() : defaultValue;
      } else {
        throw new Error(`Dependency '${key}' is not provided`);
      }
    }

    const dependency = registry.get(key) as Dependency<T>;

    if (dependency.instance) {
      return dependency.instance;
    }

    if (!dependency.isLazy) {
      throw new Error(`Dependency '${key}' has no instance nor factory`);
    }

    if (dependency.isAsync) {
      throw new Error(
        `Dependency '${key}' has an async factory, please use \`injectAsync\` instead`,
      );
    }

    dependency.instance = dependency.factory();

    return dependency.instance;
  }

  /**
   * Inject an async dependency with the specified key
   * @param token A unique injection token
   * @param defaultValue A default factory that will be invoked if dependency is not provided
   * @returns Promise of the dependency instance
   */
  async function injectAsync<T>(
    token: constructor<T> | string | symbol,
    defaultValue?: () => Promise<T>,
  ): Promise<T> {
    const key = normalizeToken(token);

    if (!registry.has(key)) {
      if (defaultValue) {
        return defaultValue();
      } else {
        throw new Error(`Dependency '${key.toString()}' is not provided`);
      }
    }

    const dependency = registry.get(key) as Dependency<T>;

    if (dependency.instance) {
      return dependency.instance;
    }

    if (!dependency.isLazy) {
      throw new Error(
        `Dependency '${key.toString()}' has no instance nor factory`,
      );
    }

    if (dependency.isAsync) {
      dependency.instance = await dependency.factory();
    } else {
      dependency.instance = dependency.factory();
    }

    return dependency.instance;
  }

  /**
   * Check if a dependency is provided
   * @param token A unique injection token
   * @returns `true` if dependency is provided, else `false`
   */
  function isProvided<T>(key: constructor<T> | string | symbol): boolean {
    return registry.has(key);
  }

  /**
   * Clear all the existing dependencies
   */
  function clear() {
    registry.clear();
  }

  return {
    provide,
    provideLazy,
    provideAsync,
    inject,
    injectAsync,
    isProvided,
    clear,
  };
}

export const container = createContainer();
