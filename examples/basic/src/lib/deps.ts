import config from '@/lib/config';
import { Config } from '@/lib/config';

export interface AppDeps {
  config: Config;
}

/**
 * Initialize app dependencies
 */
export async function init(): Promise<AppDeps> {
  return {
    config: config.load(),
  };
}

export default { init };
