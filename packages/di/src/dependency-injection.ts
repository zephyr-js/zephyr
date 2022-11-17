import { isFunction } from './utils/is-function';

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
export interface InjectionKey<T> extends Symbol {}

/**
 * Returns a new unique `InjectionKey` as `Symbol`
 * @param description Description of the key
 * @returns symbol
 */
export function InjectionKey<T>(
  description?: string | number,
): InjectionKey<T> {
  return Symbol(description);
}

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

const registry = new Map<InjectionKey<unknown>, Dependency<unknown>>();

/**
 * Provide a dependency
 * @param key A unique injection key
 * @param instance An instance of the dependency
 */
export function provide<T>(key: InjectionKey<T>, instance: T) {
  registry.set(key, {
    isLazy: false,
    instance,
  });
}

/**
 * Provide a dependency lazily, the factory will be run only on the first inject
 * @param key A unique injection key
 * @param factory A factory function that resolves the instance
 */
export function provideLazy<T>(key: InjectionKey<T>, factory: () => T) {
  registry.set(key, {
    isLazy: true,
    isAsync: false,
    instance: null,
    factory,
  });
}

/**
 * Provide a dependency with async factory, the factory will be run only on the first inject
 * @param key A unique injection key
 * @param factory An async factory function that resolves the instance
 */
export function provideAsync<T>(
  key: InjectionKey<T>,
  factory: () => Promise<T>,
) {
  registry.set(key, {
    isLazy: true,
    isAsync: true,
    instance: null,
    factory,
  });
}

/**
 * Inject a dependency with the specified key
 * @param key A unique injection key
 * @param defaultValue A default value that will be returned if dependency is not provided
 * @returns Instance of the dependency
 */
export function inject<T>(
  key: InjectionKey<T>,
  defaultValue?: T | (() => T),
): T {
  if (!registry.has(key)) {
    if (defaultValue) {
      return isFunction(defaultValue) ? defaultValue() : defaultValue;
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
    throw new Error(
      `Dependency '${key.toString()}' has an async factory, please use \`injectAsync\` instead`,
    );
  }

  dependency.instance = dependency.factory();

  return dependency.instance;
}

/**
 * Inject an async dependency with the specified key
 * @param key A unique injection key
 * @param defaultValue A default factory that will be invoked if dependency is not provided
 * @returns Promise of the dependency instance
 */
export async function injectAsync<T>(
  key: InjectionKey<T>,
  defaultValue?: () => Promise<T>,
): Promise<T> {
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
 * @param key A unique injection key
 * @returns `true` if dependency is provided, else `false`
 */
export function isProvided<T>(key: InjectionKey<T>): boolean {
  return registry.has(key);
}

/**
 * Clear all the existing dependencies
 */
export function clear() {
  registry.clear();
}
