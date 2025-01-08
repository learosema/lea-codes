---
title: Type-Annotations in JavaScript 
description: Sprinkle your JavaScript codebase with type annotations in JSDoc, run checks against it and auto-generate documentation.
date: 2025-01-08
tags:
  - javascript
  - typescript
  - jsdoc
  - automation
---
The next hot shit in node.js is being able to run typescript directly in node.js by a feature called "type stripping".
When running a `.ts` file in combination with the flag `--experimental-strip-types`, all syntax that is relevant to 
typescript is stripped when the file is parsed. This is still a bit experimental as of current.

In a hobby project, I tried a slightly less hot thing. Less hot, but pretty stable to use and available in TypeScript from the beginnings: 
have it the other way round. 

Write JavaScript code without all the type juggling, sprinkle it with a couple JSDoc comments. 
JSDoc can be used to describe your declarations. This will help autocomplete feature (aka IntelliSense for Microsoft-style IDEs). 

You can annotate JSDoc with TypeScript types. These are also used to display type information in the autocompletion feature. 
You can additionally check the JavaScript code base by the typescript compiler.

How does JSDoc-annotated code look like?

```jsdoc
/**
 * Poor girl's handlebars
 *
 * @param {string} content the template content
 * @param {Record<string, string>} [data] the data object
 * @param {TemplateConfig} [config] the template configuration, 
 * where you can specify additional filters available inside the template
 * @returns {Promise<string>} the template result string
 */
export async function template(content, data, config) {}
```

You can place a little comment block above your function (or whatever else you want to document). In curly braces, you can additionally provide the types used in
parameters or returns. Whenever you have an asynchronous function, remember to return a `Promise<returnType>` of your return type. Parameters can be 
specified as optional via square brackets. Your code editor may auto-insert such a block whenever you write `/**` and hit enter above a declaration.

Every built-in type you know from TypeScript is available. This includes primitives such as `string`, `number` `boolean` but also more complex object types.
Object types can be defined using the `@typedef` directive. The definition of the `TemplateConfig` object looks like this:

```jsdoc
/**
 * @typedef TemplateConfig
 * Configuration object for the template() function.
 * @property {Map<string, Function>} [filters] map of additional filters to be used
 */
```

## Interfaces?

A thing loved by software architects and design pattern evangelists in programming languages are `interface`s, wich are often used in
Software Design concepts such as [Dependency Injection](https://builtin.com/articles/dependency-injection#:~:text=Dependency%20injection%20is%20about%20injecting,and%20embracing%20loosely%20coupled%20code.).

But JavaScript lacks interfaces. And JavaScript is often criticized due to that. 

That can also be represented as a `@typedef` in JSDoc. 

As an example, look at the following TypeScript:
```ts
interface FileResolver {
    async loadFile(fileName: string): Promise<string|Buffer>
}
```

It can be represented via JSDoc:

```jsdoc
/**
 * @typeDef FileResolver
 * @property {(fileName: string) => Promise<string|Buffer>} loadFile
 */
```

## Using types from other files

Using types from other files is a bit tedious though.
How would you reference a type from another file?

Microsoft IntelliSense in Visual Studio and Visual Studio Code have a special syntax for it. 
So called triple-slash-references:

```js
///<reference path="typedefs.js"/>
```

But jsdoc requires another syntax, which looks like this

```js
/**
 * My setup function 
 * @param {import("./typedefs.js").Configuration} [config] 
 */
function setup(config) {
}
```

This works for me, but it's a bit verbose. You can use a combination of both: The triple-slash reference and the inline type imports.
Unfortunately, I haven't found a simpler way yet.

## Setting up TypeScript

Let's have a look how you can use TypeScript in your project without writing TypeScript but JavaScript with JSDoc.

First, install typescript as a devDependency.

```
npm install typescript -D
```

In the tsconfig, you can specify `allowJs: true` and `checkJs: true`. This allows you to use JavaScript in TypeScript and let it check by the typescript Compiler. 

Regarding my rules, I've set strict to true, but noImplicitAny set to false. With some effort, I could get it to work with noImplicitAny set to true, but this would have required me to add more typings with inline comments. In general, that would also be a good starter ruleset to migrate a JavaScript codebase to TypeScript. 

Having tsc to check the JavaScript still helped me find certain problems where stuff could possibly be undefined.

For my js-only codebase, I went with this `tsconfig.json`, extending from a node22-preset. At the time of this writing, node 22 was the LTS version.

```
npm install @tsconfig/node22 -D
```
```js
{
  "extends": "@tsconfig/node22/tsconfig.json",
  "compilerOptions": {
    "rootDir": "./src",
    "allowJs": true,
    "checkJs": true,
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "outDir": "./dist",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitAny": false,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

When I run `npx tsc` now, it would generate type declarations for all files in `src` and save them to `dist`. 

## Auto-generate documentation

Additionally, I even could run `typedoc` which generates a nice website with the API for me.
I found this super helpful, so I built a Github action that builds and deploys it:

```sh
npm install typedoc -D
```
```yaml
# .github/workflows/documentation.yaml:
name: Deploy API Documentation to GitHub Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["main"]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment,
# skipping runs queued between the run in-progress and latest queued.
# However, do not cancel in-progress runs.
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Build API documentation
        run: |
          npm ci
          npm run docs
          touch docs/.nojekyll
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'docs'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
