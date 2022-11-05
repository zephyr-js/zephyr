import zephyr from '@zephyr-js/core';

const bootstrap = async () => {
  const app = zephyr();
  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.info('Zephyr application is running on port', port),
  );
};

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
