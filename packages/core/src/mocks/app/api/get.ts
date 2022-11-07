import { ZephyrHandler } from '@zephyr-js/common';

export const handler: ZephyrHandler = (_, res) => {
  return res.send('OK');
};
