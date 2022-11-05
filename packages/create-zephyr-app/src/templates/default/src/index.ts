import { ZephyrApplication } from '@zephyr/core';

const bootstrap = async () => {
  const app = new ZephyrApplication();
  const port = process.env.PORT;
  app.listen(port, () =>
    console.info('Zephyr application is running on port', port),
  );
};

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
