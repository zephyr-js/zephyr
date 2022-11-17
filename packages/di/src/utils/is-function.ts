export function isFunction(
  instance: unknown,
): instance is (...args: any[]) => any {
  return typeof instance === 'function';
}
