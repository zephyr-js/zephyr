import * as config from '@zephyr-js/config';
import { z } from 'zod';

const schema = z.object({
  env: z.string(),
  port: z.number(),
});

export type Config = z.infer<typeof schema>;

/**
 * Load config from `/config/<env>.json`
 * @returns {Config} Config instance
 *
 * {@link https://zephyrjs.com/docs}
 */
export function load(): Config {
  return config.load<Config>({ schema });
}

export default { load };
