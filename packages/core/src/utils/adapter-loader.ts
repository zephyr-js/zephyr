import { HttpAdapter, ValidAdapter } from '@zephyrjs/common';

export const loadAdapter = (adapter: ValidAdapter): HttpAdapter => {
  try {
    return require(adapter);
  } catch (err) {
    console.error('Unable to load adapter');
    process.exit(1);
  }
};
