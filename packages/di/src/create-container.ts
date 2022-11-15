import { isAsyncFunction } from './utils/is-promise';

interface Container<T extends object> {
  registerSingleton<K extends keyof T>(key: K, instance: T[K]): void;
  registerLazySingleton<K extends keyof T>(
    key: K,
    factoryFunc: () => T[K],
  ): void;
  registerSingletonAsync<K extends keyof T>(
    key: K,
    factoryFunc: () => Promise<T[K]>,
  ): void;
  isRegistered(key: keyof T): boolean;
  unregister(key: keyof T): void;
  resetLazySingleton<K extends keyof T>(key: K, factoryFunc: () => T[K]): void;
  resolve<K extends keyof T>(key: K): T[K];
  resolveAsync<K extends keyof T>(key: K): Promise<T[K]>;
  reset(): void;
}

type Dependency<T> =
  | { instance: T }
  | { factoryFunc: (() => T) | (() => Promise<T>); instance?: T };

export function createContainer<T extends object>(): Container<T> {
  const registry = new Map<keyof T, Dependency<T[keyof T]>>();

  const registerSingleton: Container<T>['registerSingleton'] = (
    key,
    instance,
  ) => {
    registry.set(key, { instance });
  };

  const registerLazySingleton: Container<T>['registerLazySingleton'] = (
    key,
    factoryFunc,
  ) => {
    registry.set(key, { factoryFunc });
  };

  const registerSingletonAsync: Container<T>['registerSingletonAsync'] = (
    key,
    factoryFunc,
  ) => {
    registry.set(key, { factoryFunc });
  };

  const isRegistered: Container<T>['isRegistered'] = (key) => {
    return registry.has(key);
  };

  const unregister: Container<T>['unregister'] = (key) => {
    registry.delete(key);
  };

  const resetLazySingleton: Container<T>['resetLazySingleton'] = (
    key,
    factoryFunc,
  ) => {
    registry.set(key, { factoryFunc });
  };

  const reset: Container<T>['reset'] = () => {
    registry.clear();
  };

  const resolve: Container<T>['resolve'] = (key) => {
    const dependency = registry.get(key);
    if (!dependency) {
      throw new Error(`Dependency '${key.toString()}' is not registered`);
    }
    if ('factoryFunc' in dependency && !('instance' in dependency)) {
      if (isAsyncFunction(dependency.factoryFunc)) {
        throw new Error(
          `Factory function for dependency '${key.toString()}' is asynchronous, please use 'resolveAsync()' instead`,
        );
      }
      dependency.instance = dependency.factoryFunc();
    }
    return dependency.instance as T[typeof key];
  };

  const resolveAsync: Container<T>['resolveAsync'] = async (key) => {
    const dependency = registry.get(key);
    if (!dependency) {
      throw new Error(`Dependency '${key.toString()}' is not registered`);
    }
    if ('factoryFunc' in dependency && !('instance' in dependency)) {
      if (!isAsyncFunction(dependency.factoryFunc)) {
        throw new Error(
          `Factory function for dependency '${key.toString()}' is synchronous, please use 'resolve()' instead`,
        );
      }
      dependency.instance = await dependency.factoryFunc();
    }
    return dependency.instance as T[typeof key];
  };

  return {
    registerSingleton,
    registerLazySingleton,
    registerSingletonAsync,
    isRegistered,
    unregister,
    resetLazySingleton,
    reset,
    resolve,
    resolveAsync,
  };
}
