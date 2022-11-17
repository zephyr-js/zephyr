import { beforeEach, describe, expect, test } from 'vitest';
import {
  provide,
  provideLazy,
  inject,
  clear,
  InjectionKey,
  isProvided,
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

  test('should return instance when lazy dependency is instantiated before', () => {
    const foo: InjectionKey<string> = Symbol();
    provideLazy(foo, () => 'foo');
    expect(inject(foo)).toEqual('foo');
    expect(inject(foo)).toEqual('foo');
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
});
