import { createApp, cors, json } from '@zephyr-js/core';
import deps from '@/lib/deps';

/**
 * Bootstrap Zephyr application
 */
async function bootstrap(): Promise<void> {
  const dependencies = await deps.init();

  const app = await createApp({
    dependencies,
    middlewares: [cors(), json()],
  });

  const { config } = dependencies;

  await app.listen(config.port);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
