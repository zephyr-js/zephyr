import { ZephyrHandler } from '@zephyr-js/common';

export const handler: ZephyrHandler = async (req, res) => {
  return res.json({ message: 'Hello world!' });
};
