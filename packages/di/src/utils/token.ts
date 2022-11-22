import constructor from '@/types/constructor';

export function normalizeToken<T>(
  token: constructor<T> | string | symbol,
): string {
  return isConstructorToken(token) ? token.name : token.toString();
}

export function isConstructorToken<T>(
  token?: constructor<T> | string | symbol,
): token is constructor<T> {
  return typeof token === 'function';
}
