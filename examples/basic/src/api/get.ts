import { ZephyrHandler, ZephyrRequest, ZephyrResponse } from '@zephyr/common';

export const handler: ZephyrHandler = async (
  req: ZephyrRequest,
  res: ZephyrResponse,
) => {
  return res.json({ message: 'Hello world!' });
};
