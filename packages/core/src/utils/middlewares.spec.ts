import { describe, test, beforeAll, expect } from 'vitest';
import supertest from 'supertest';
import {
  createErrorMiddleware,
  createHandlerMiddleware,
  createValidationMiddleware,
} from './middlewares';
import express, { RequestHandler } from 'express';
import { z } from 'zod';
import { ZephyrHandler } from '@zephyr-js/common';

describe('createHandlerMiddleware()', () => {
  let app: ReturnType<typeof express>;

  beforeAll(() => {
    const handler: RequestHandler = async (_, res) => {
      return res.send('OK');
    };
    const handlerMiddleware = createHandlerMiddleware(handler as ZephyrHandler);

    app = express();
    app.get('/', handlerMiddleware);
  });

  test('should return 200', async () => {
    const response = await supertest(app).get('/').expect(200);
    expect(response.text).toBe('OK');
  });
});

describe('createValidationMiddleware()', () => {
  let app: ReturnType<typeof express>;

  beforeAll(() => {
    app = express();

    const schema = z.object({
      query: z.object({
        message: z.string(),
      }),
    });

    const validationMiddleware = createValidationMiddleware(schema);
    const handler: ZephyrHandler = (_, res) => res.send('OK');

    app.get('/', validationMiddleware, handler);

    app.use(createErrorMiddleware());
  });

  test('should return 200 with no validation errors', async () => {
    const response = await supertest(app)
      .get('/')
      .query({ message: 'hello' })
      .expect(200);
    expect(response.text).toBe('OK');
    expect(response.body).to.not.haveOwnProperty('errors');
  });

  test('should return 400 with validation errors', async () => {
    const response = await supertest(app).get('/').expect(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);
  });
});

describe('createErrorMiddleware()', () => {
  test('Default error middleware', async () => {
    const app = express();

    const handlerMiddleware = createHandlerMiddleware(async () => {
      throw new Error('Something went wrong');
    });
    app.get('/', handlerMiddleware);

    const errorMiddleware = createErrorMiddleware();
    app.use(errorMiddleware);

    const response = await supertest(app).get('/').expect(500);
    expect(response.text).toBe('Internal server error');
  });

  test('Custom error function in middleware', async () => {
    const app = express();

    const handlerMiddleware = createHandlerMiddleware(async () => {
      throw new Error('Something went wrong');
    });
    app.get('/', handlerMiddleware);

    const errorMiddleware = createErrorMiddleware((req, res) => {
      return res.status(401).send('Unauthorized');
    });
    app.use(errorMiddleware);

    const response = await supertest(app).get('/').expect(401);
    expect(response.text).toBe('Unauthorized');
  });
});
