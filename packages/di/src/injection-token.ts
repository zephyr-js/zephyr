import constructor from '@/types/constructor';

export type InjectionToken<T = any> = constructor<T> | string | symbol;

export function isConstructorToken(
  token?: InjectionToken<any>,
): token is constructor<any> {
  return typeof token === 'function';
}

export function normalizeToken<T>(token: InjectionToken<T>): string {
  return isConstructorToken(token) ? token.name : token.toString();
}
