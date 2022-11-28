import { createApp } from '@zephyr-js/core';
import deps from '@/lib/deps';

/**
 * Bootstrap Zephyr application
 */
async function bootstrap(): Promise<void> {
  const dependencies = await deps.init();
  const app = await createApp({ dependencies });
  const { config } = dependencies;
  app.listen(config.port);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
