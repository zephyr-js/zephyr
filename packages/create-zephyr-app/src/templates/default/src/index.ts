import { createApp } from '@zephyr-js/core';

const bootstrap = async () => {
  const app = await createApp();
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () =>
    console.info('Zephyr application is running on port', port),
  );
};

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
