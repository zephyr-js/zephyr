import { InjectionKey } from '@zephyr-js/di';

type Calculator = {
  sum: (x: number, y: number) => number;
};

export const INJECTION_KEYS = {
  CALCULATOR: InjectionKey<Calculator>(),
};
