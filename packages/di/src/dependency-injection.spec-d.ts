import { describe, expectTypeOf, test } from 'vitest';
import { inject, InjectionKey, provide } from './dependency-injection';

describe('Provide and resolve type inference', () => {
  test('should able to inference `provide` type', () => {
    const key = InjectionKey<string>();
    expectTypeOf(provide<string>).parameters.toEqualTypeOf<
      [typeof key, string]
    >();
  });

  test('should able to inference `inject` type', () => {
    const key = InjectionKey<string>();
    provide(key, 'foo');
    expectTypeOf(inject(key)).toEqualTypeOf<string>();
  });
});
