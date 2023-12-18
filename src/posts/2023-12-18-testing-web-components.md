---
title: Testing Web Components
description: A write-up on testing web components.
date: 2023-12-18
tags:
  - javascript
---

With the help of the `customElements` API, developers for the web platform can now build their own custom html elements, bringing a zero-footprint approach to a component-based archtitecture to the web.

## But what about testing?

Testing might still be one of the reasons why people choose a framework like React rather than working with the native web components.

But it turns out testing web components is not too complex. All you need is a test runner of your choice and a  DOM API. There you have several options:

- run the tests in a real browser, or a headless one
- use a console-based test runner with a (fake) DOM library

## Using the node.js test runner

As I learned via the talk by [Sebastian Schürmann](https://github.com/hamburg-js/proposals/issues/26), node.js comes with its own integrated test runner. By default, `node --test` runs all files in the project which are suffixed with `.test.js`, `.test.cjs` and `.test.mjs`.

For this article, I've created a test project with a password-input web component as a demo: [wctest](https://github.com/learosema/wctest).

The test is using the `describe` and `it`-syntax which can be imported from `"node:test"`.

In order to be able to run DOM APIs inside my test, I have to emulate it for my test environment. I'm using [linkedom](https://github.com/WebReflection/linkedom) which is a fast implementation based on [JSDON](https://github.com/WebReflection/jsdon#readme) and linked lists.

It works like this:

```js
import { parseHTML } from 'linkedom';

const {
  window, document, customElements,
  HTMLElement, Event, CustomEvent
} = parseHTML(`
  <!doctype html>
  <html lang="en">
    <body>
    </body>
  </html>
`);
```

It even comes with the `customElements` API so this works nearly out of the box.
The only tricky thing might be the fact I won't get global namespace pollution, which is normally a good thing, but my modules to be tested need them in the global namespace.

So, the workaround I'm using is to put the APIs consumed into the global namespace and then do a dynamic import of my module in the test setup:

```js
describe('password-input component', ()=> {
  let window, document, customElements, HTMLElement, DocumentFragment, PasswordInput, Event;

  before(async () => {
    window = global.window = parseHTML(`<!DOCTYPE html><html><head></head><body></body></html>`);
    DocumentFragment = global.DocumentFragment = window.DocumentFragment;
    document = global.document = window.document;
    customElements = global.customElements = window.customElements;
    Event = global.Event = window.Event;
    HTMLElement = global.HTMLElement = window.HTMLElement;

    const module = await import('./password-input.js');
    
    PasswordInput = module.PasswordInput;
    PasswordInput.register();
  });
});
```

## Alternative: jest

A more common choice to test web components is to use jest. I haven't prepared a special demo for this article, but I did this in the past with my [shader-art](https://github.com/shader-art/shader-art/) web component, which is for a lightweight embedding of shader animations into websites while respecting "reduced motion" settings of your operating system.

You can configure jest to use JSDOM which allows you to use DOM-APIs. One essential configuration option you have to specify in your `jest.config.js` is `testEnvironment: 'jsdom'`.

Additionally, you can also specify how jest would handle further things, which could also impact your test execution time. For testing canvas2d graphics, you can npm install `canvas` and jsdom will use that to emulate the canvas API. That would even allow you to do some visual regression testing.

When emulating the canvas API in your test, you may also want to work with images. So, another setting that comes into play is `resources: 'usable'`, which is configured in the `testEnvironmentOptions` inside the `jest.config.js`.

```js
module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    resources: 'usable',
  },
}
```

For my shader-art component, I chose to use a webgl mock for jest which you can install via NPM and specify it via `setupFiles: ['jest-webgl-canvas-mock']` inside the `jest.config.js`.

## Further approaches?

For now, I decided for me that those above two approaches are enough for me for now. I'm would be excited to explore other approaches which may involve using a headless browser and/or cypress. If you have a demo project or want to talk about it with me, feel free to reach out. 💖
