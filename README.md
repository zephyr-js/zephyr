<p align="center">
  <a href="https://github.com/zephyr-js/zephyr">
    <picture>
      <img src="https://user-images.githubusercontent.com/40446720/200107694-75fd7950-53ca-47c6-8cba-3e42a3c168f5.png" height="128" alt="Zephyr.js logo">
    </picture>
    <h1 align="center">Zephyr.js</h1>
    <p align="center">
      <h3 align="center">Build Typesafe Node API in minutes</h3>
      <p align="center">
        <a href="https://github.com/zephyr-js/zephyr/actions/workflows/ci.yml">
          <img src="https://github.com/zephyr-js/zephyr/actions/workflows/ci.yml/badge.svg" alt="Zephyr.js CI workflow" />
        </a>
        <a href="https://codecov.io/gh/zephyr-js/zephyr">
          <img src="https://codecov.io/gh/zephyr-js/zephyr/branch/main/graph/badge.svg" />
        </a>
        <a href="https://www.codefactor.io/repository/github/zephyr-js/zephyr">
          <img src="https://www.codefactor.io/repository/github/zephyr-js/zephyr/badge" alt="CodeFactor" />
        </a>
      </p>
    </p>
  </a>
</p>

## Description

**Zephyr** is a <a href="https://www.typescriptlang.org/" target="_blank">Typescript</a> server-side meta framework that is inspired by <a href="https://nextjs.org/" target="_blank">Next.js</a> for its **file-based routing**.
It is built on top of <a href="https://expressjs.com/" target="_blank">Express.js</a> and uses <a href="https://zod.dev/" target="_blank">Zod</a> in request / response validation as well as providing typesafe API.

**Zephyr** places a high value on **FP (Functional Programming)**. Instead of using classes as API controllers, declare and export API routes with functions.

## Philosophy

The established server-side web frameworks for Node.js at the moment are [Nest.js](https://nestjs.com/) and [Adonis.js](https://adonisjs.com/), both of which are fantastic and rely on controllers and decorators in OOP. However, some programmers prefer functional programming to object-oriented programming (OOP). As a result, Zephyr seeks to let programmers to define API routes with functions and provides file-based routing out of the box.

## Getting started

Kindly visit our documentation on [zephyrjs.com](https://zephyrjs.com/)

## Overview

**Bootstrapping Project**

```bash
npm create zephyr-app <app-name>
yarn create zephyr-app <app-name>
pnpm create zephyr-app <app-name>
```

**Defining API Route**

```ts
// src/routes/login.ts

import { defineRoute } from '@zephyr-js/core';

// POST /login
export function POST() {
  return defineRoute({
    schema: z.object({
      body: z.object({
        email: z.string(),
        password: z.string(),
      }),
      response: z.object({
        success: z.boolean(),
      }),
    }),
    onRequest(req) {
      logger.info('Request received', req.method, req.path);
    },
    async handler({ body }) {
      await login(body);
      return { success: true };
    },
    onErrorCaptured(req, res, err) {
      logger.error('Login failed', err);
      res.status(500);
      return { success: false };
    },
  });
}
```

## TODO

- [x] Complete `create-zephyr-app`
- [x] Publish `@zephyr-js/core`, `@zephyr-js/common` and `create-zephyr-app` to [NPM](https://www.npmjs.com/)
- [x] Create unit tests
- [x] Supports dependency injection
- [ ] Create `zephyr` cli
