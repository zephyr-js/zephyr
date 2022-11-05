<p align="center">
  <a href="https://github.com/zephyr-js/zephyr">
    <picture>
      <img src="https://user-images.githubusercontent.com/40446720/200107694-75fd7950-53ca-47c6-8cba-3e42a3c168f5.png" height="128" alt="Zephyr.js logo">
    </picture>
    <h1 align="center">Zephyr.js</h1>
    <p align="center">A modern <a href="http://nodejs.org" target="_blank">Node.js</a> meta framework designed to provide the best developer experience possible.</p>
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

<!-- ## Quickstart
```sh
# pnpm
pnpm create zephyr-app <app-name>
# yarn
yarn create zephyr-app <app-name>
# npm
npx create-zephyr-app <app-name>
``` -->

## TODO
- [ ] Supports middleware
- [ ] Complete `create-zephyr-app`
- [ ] Publish `@zephyr-js/core`, `@zephyr-js/common` and `create-zephyr-app` to [NPM](https://www.npmjs.com/)
- [ ] Create `zephyr` cli
- [ ] Create unit tests
