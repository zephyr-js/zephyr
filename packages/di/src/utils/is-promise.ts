export function isAsyncFunction<T>(
  fn: (() => T) | (() => Promise<T>),
): fn is () => Promise<T> {
  return fn.constructor.name === 'AsyncFunction';
}
