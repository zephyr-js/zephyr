<p align="center">
  <a href="https://github.com/zephyr-js/zephyr">
    <picture>
      <img src="https://user-images.githubusercontent.com/40446720/200107694-75fd7950-53ca-47c6-8cba-3e42a3c168f5.png" height="128" alt="Zephyr.js logo">
    </picture>
    <h1 align="center">Zephyr.js</h1>
    <p align="center">A functional <a href="http://nodejs.org" target="_blank">Node.js</a> meta framework designed to provide the best developer experience possible.
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

The established server-side web frameworks for Node.js at the moment are [Nest.js](https://nestjs.com/) and [Adonis.js](https://adonisjs.com/), both of which are fantastic and rely on controllers and decorators in OOP. However, some programmers prefer functional programming to object-oriented programming (OOP). As a result, Zephyr seeks to let programmers write and export functions as API routes and incorporates file-based routing from Next.js.

## Getting started

Kindly visit our documentation on [zephyrjs.com](https://zephyrjs.com/)

## TODO

- [x] Complete `create-zephyr-app`
- [x] Publish `@zephyr-js/core`, `@zephyr-js/common` and `create-zephyr-app` to [NPM](https://www.npmjs.com/)
- [x] Create unit tests
- [ ] Supports middleware
- [ ] Supports dependency injection
- [ ] Create `zephyr` cli
