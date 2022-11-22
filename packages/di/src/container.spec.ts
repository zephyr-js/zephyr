import { beforeEach, describe, expect, test, vi } from 'vitest';
import { container, createContainer } from './container';

describe('container', () => {
  beforeEach(() => {
    container.clear();
  });

  test('should create an container instance', () => {
    const container = createContainer();
    expect(container).toHaveProperty('provide');
    expect(container).toHaveProperty('provideLazy');
    expect(container).toHaveProperty('provideAsync');
    expect(container).toHaveProperty('inject');
    expect(container).toHaveProperty('injectAsync');
    expect(container).toHaveProperty('isProvided');
    expect(container).toHaveProperty('clear');
  });

  test('should provide and inject dependency', () => {
    container.provide('foo', 'foo');
    expect(container.inject<string>('foo')).toEqual('foo');
  });

  test('should provide and inject lazy dependency', () => {
    container.provideLazy('foo', () => 'foo');
    expect(container.inject<string>('foo')).toEqual('foo');
  });

  test('should only invoke factory function once on lazy dependency', () => {
    const fn = vi.fn().mockReturnValue('foo');
    container.provideLazy('fn', fn);
    expect(container.inject<string>('fn')).toEqual('foo');
    expect(container.inject<string>('fn')).toEqual('foo');
    expect(fn).toHaveBeenCalledOnce();
  });

  test('should provide and inject async dependency', async () => {
    container.provideAsync('foo', async () => 'foo');
    expect(await container.injectAsync('foo')).toEqual('foo');
  });

  test('should only invoke async factory once on async dependency', async () => {
    const fn = vi.fn().mockResolvedValue('foo');
    container.provideAsync('foo', fn);
    expect(await container.injectAsync<string>('foo')).toEqual('foo');
    expect(await container.injectAsync<string>('foo')).toEqual('foo');
    expect(fn).toHaveBeenCalledOnce();
  });

  test('should throw error when inject a non-existent dependency', () => {
    expect(() => container.inject('foo')).toThrow(
      'Dependency \'foo\' is not provided',
    );
  });

  test('should inject specified default value if dependency not provided', () => {
    expect(container.inject<string>('foo', 'foo')).toEqual('foo');
  });

  test('should inject default value with specified factory if dependency not provided', () => {
    expect(container.inject<string>('foo', () => 'foo')).toEqual('foo');
  });

  test('should inject specified default value if async dependency not provided', async () => {
    expect(
      await container.injectAsync<string>('foo', async () => 'foo'),
    ).toEqual('foo');
  });

  test('should throw error if async dependency not provided and no default value is provided', async () => {
    await expect(() => container.injectAsync('foo')).rejects.toThrow(
      'Dependency \'foo\' is not provided',
    );
  });

  test('should also inject non async instance on `injectAsync` call', async () => {
    container.provideLazy('foo', () => 'foo');
    expect(await container.injectAsync('foo')).toEqual('foo');
  });

  test('should return true when dependency is provided', () => {
    container.provide('foo', 'foo');
    expect(container.isProvided('foo')).toEqual(true);
  });

  test('should return false when dependency is not provided', () => {
    expect(container.isProvided('foo')).toEqual(false);
  });

  test('should clear dependencies', () => {
    container.provide('foo', 'foo');
    expect(container.isProvided('foo')).toEqual(true);
    container.clear();
    expect(container.isProvided('foo')).toEqual(false);
  });

  test('should throw error when injecting async dependency with `inject`', () => {
    container.provideAsync('foo', async () => 'foo');
    expect(container.provideAsync('foo', async () => 'foo'));
    expect(() => container.inject('foo')).toThrow(
      'Dependency \'foo\' has an async factory, please use `injectAsync` instead',
    );
  });

  test('should throw error when dependency has no instance nor factory', () => {
    container.provide('foo', undefined);
    expect(() => container.inject('foo')).toThrow(
      'Dependency \'foo\' has no instance nor factory',
    );
  });

  test('should throw error when async dependency has no instance nor factory', async () => {
    container.provide('foo', undefined);
    await expect(() => container.injectAsync('foo')).rejects.toThrow(
      'Dependency \'foo\' has no instance nor factory',
    );
  });
});
