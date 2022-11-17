import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  provide,
  provideLazy,
  inject,
  clear,
  InjectionKey,
  isProvided,
  provideAsync,
  injectAsync,
} from './dependency-injection';

describe('Dependency injection', () => {
  beforeEach(() => {
    clear();
  });

  test('should create symbol as injection key', () => {
    const key = InjectionKey<string>();
    expect(typeof key).toEqual('symbol');
  });

  test('should provide and inject dependency', () => {
    const foo: InjectionKey<string> = Symbol();
    provide(foo, 'foo');
    expect(inject(foo)).toEqual('foo');
  });

  test('should provide and inject lazy dependency', () => {
    const foo: InjectionKey<string> = Symbol();
    provideLazy(foo, () => 'foo');
    expect(inject(foo)).toEqual('foo');
  });

  test('should only invoke factory function once on lazy dependency', () => {
    const foo: InjectionKey<string> = Symbol();
    const fn = vi.fn().mockReturnValue('foo');
    provideLazy(foo, fn);
    expect(inject(foo)).toEqual('foo');
    expect(inject(foo)).toEqual('foo');
    expect(fn).toHaveBeenCalledOnce();
  });

  test('should provide and inject async dependency', async () => {
    const foo = InjectionKey<string>();
    provideAsync(foo, async () => 'foo');
    expect(await injectAsync(foo)).toEqual('foo');
  });

  test('should only invoke async factory once on async dependency', async () => {
    const foo = InjectionKey<string>();
    const fn = vi.fn().mockResolvedValue('foo');
    provideAsync(foo, fn);
    expect(await injectAsync(foo)).toEqual('foo');
    expect(await injectAsync(foo)).toEqual('foo');
    expect(fn).toHaveBeenCalledOnce();
  });

  test('should throw error when inject a non-existent dependency', () => {
    const foo: InjectionKey<string> = Symbol();
    expect(() => inject(foo)).toThrow(
      `Dependency '${foo.toString()}' is not provided`,
    );
  });

  test('should inject specified default value if dependency not provided', () => {
    const foo: InjectionKey<string> = Symbol();
    expect(inject(foo, 'foo')).toEqual('foo');
  });

  test('should inject default value with specified factory if dependency not provided', () => {
    const foo: InjectionKey<string> = Symbol();
    expect(inject(foo, () => 'foo')).toEqual('foo');
  });

  test('should inject specified default value if async dependency not provided', async () => {
    const foo: InjectionKey<string> = Symbol();
    expect(await injectAsync(foo, async () => 'foo')).toEqual('foo');
  });

  test('should throw error if async dependency not provided and no default value is provided', async () => {
    const foo: InjectionKey<string> = Symbol();
    await expect(() => injectAsync(foo)).rejects.toThrow(
      `Dependency '${foo.toString()}' is not provided`,
    );
  });

  test('should also inject non async instance on `injectAsync` call', async () => {
    const foo: InjectionKey<string> = Symbol();
    provideLazy(foo, () => 'foo');
    expect(await injectAsync(foo)).toEqual('foo');
  });

  test('should return true when dependency is provided', () => {
    const foo: InjectionKey<string> = Symbol();
    provide(foo, 'foo');
    expect(isProvided(foo)).toEqual(true);
  });

  test('should return false when dependency is not provided', () => {
    const foo: InjectionKey<string> = Symbol();
    expect(isProvided(foo)).toEqual(false);
  });

  test('should clear dependencies', () => {
    const foo: InjectionKey<string> = Symbol();
    provide(foo, 'foo');
    expect(isProvided(foo)).toEqual(true);
    clear();
    expect(isProvided(foo)).toEqual(false);
  });

  test('should throw error when injecting async dependency with `inject`', () => {
    const foo = InjectionKey<string>();
    provideAsync(foo, async () => 'foo');
    expect(() => inject(foo)).toThrow(
      `Dependency '${foo.toString()}' has an async factory, please use \`injectAsync\` instead`,
    );
  });

  test('should throw error when dependency has no instance nor factory', () => {
    const foo = InjectionKey<string>();
    provide(foo, undefined);
    expect(() => inject(foo)).toThrow(
      `Dependency '${foo.toString()}' has no instance nor factory`,
    );
  });

  test('should throw error when async dependency has no instance nor factory', async () => {
    const foo = InjectionKey<string>();
    provide(foo, undefined);
    await expect(() => injectAsync(foo)).rejects.toThrow(
      `Dependency '${foo.toString()}' has no instance nor factory`,
    );
  });
});
