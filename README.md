<p align="center">
  <a href="https://github.com/zephyr-js/zephyr">
    <picture>
      <img src="https://user-images.githubusercontent.com/40446720/200107694-75fd7950-53ca-47c6-8cba-3e42a3c168f5.png" height="128" alt="Zephyr.js logo">
    </picture>
    <h1 align="center">Zephyr.js</h1>
    <p align="center">A modern <a href="http://nodejs.org" target="_blank">Node.js</a> meta framework designed to provide the best developer experience possible.
      <p align="center">
        <a href="https://github.com/zephyr-js/zephyr/actions/workflows/ci.yml">
          <img src="https://github.com/zephyr-js/zephyr/actions/workflows/ci.yml/badge.svg" alt="Zephyr.js CI workflow" />
        </a>
        <a href="https://codecov.io/gh/zephyr-js/zephyr">
          <img src="https://codecov.io/gh/zephyr-js/zephyr/branch/main/graph/badge.svg" />
        </a>
      </p>
    </p>
  </a>
</p>

## Description

Zephyr is a <a href="https://www.typescriptlang.org/" target="_blank">Typescript</a> server-side meta framework that is highly inspired by Next.js.
It is built on top of <a href="https://expressjs.com/" target="_blank">Express.js</a> and uses <a href="https://zod.dev/" target="_blank">Zod</a> in request / response validation as well as providing type-safe API.

Zephyr places a high value on FP (Functional Programming). Instead of using classes as API controllers, declare and export functions for each file as API endpoint.

## Philosophy

Node.js is great for Typescript server-side development.
But when it comes to DX (Developer Experience), currently there is no Node.js framework that compares to <a href="https://nextjs.org/" target="_blank">Next.js</a> (in the React ecosystem).

Zephyr extends the Next.js concept to API development.
It has a file-system based router, but rather than exporting a React component for each file, we will export an API handler.

## Features

- ↪️&nbsp; Excellent routing mechanism - File-system based routing like Next.js.
- ⚙️&nbsp; Functional by default - Write functions instead of bloated API controllers with hundreds of decorators.
- ✍️&nbsp; Type-safe - Request and response types are typed checked and validated.
- ✨&nbsp; Productivity boost - Bootstrap your project with `create-zephyr-app` and start writing API endpoints.
- 🍃&nbsp; Lightweight - Zephyr is only a thin layer on top of Express.

## Getting started

### Bootstrap project
```sh
# pnpm
pnpm create zephyr-app <app-name>
# yarn
yarn create zephyr-app <app-name>
# npm
npx create-zephyr-app <app-name>
```

### Running development server
```sh
# pnpm
pnpm dev
# yarn
yarn dev
# npm
npm run dev
```

## A small taste

All files under `src/api` will be automatically mapped to API endpoints with their respective paths.

### Basic
```typescript
// src/api/get.ts
// This file will be mapped to "GET /" endpoint

import { ZephyrHandler } from '@zephyr-js/common';

// Endpoint handler
export const handler: ZephyrHandler = async (req, res) => {
  return res.json({ message: 'Hello world!' });
};
```

### Type safety and validation

```typescript
// src/api/items/post.ts
// This file will be mapped to "POST /items" endpoint

import { z } from 'zod';
import { ZephyrHandlerWithSchema } from '@zephyr-js/common';

// Model schema
const ItemSchema = z.object({
  name: z.string(),
  price: z.number(),
});

// Model type
type Item = z.infer<typeof ItemSchema>;

// Endpoint schema, auto validated with Zod
// Supports `params`, `body`, `query` and `response`
export const schema = z.object({
  // Request body
  body: ItemSchema,
  // Response body
  response: z.object({
    item: ItemSchema,
  }),
});

// Endpoint handler
// Request and response type are inferred from the schema above
export const handler: ZephyrHandlerWithSchema<typeof schema> = async (
  req,
  res,
) => {
  const item: Item = req.body; // Type checked
  return res.json({ item }); // Type checked
};

```

## TODO
- [x] Complete `create-zephyr-app`
- [x] Publish `@zephyr-js/core`, `@zephyr-js/common` and `create-zephyr-app` to [NPM](https://www.npmjs.com/)
- [ ] Create unit tests
- [ ] Supports middleware
- [ ] Supports dependency injection
- [ ] Create `zephyr` cli
