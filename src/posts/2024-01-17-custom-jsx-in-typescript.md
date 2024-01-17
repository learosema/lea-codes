---
title: Custom JSX in TypeScript
description: JSX can be used without React, here's how it can be used with the DOM API and TypeScript's built-in JSX transform feature
tags:
  - typescript
  - jsx
date: 2024-01-17
---
I'm in a love-hate relationship with React. In my day-to-day work, I work a lot with React. In my personal projects, I prefer working with more lightweight stacks, keeping the client-side JavaScript load in the browser as lean and tiny as possible.

Still, there are certain use-cases where I need to generate markup on the client-side from time to time, usually everytime where I need JavaScript anyway for a certain functionality.

## Code Example

An example where I recently used JSX was for modal dialogs in my [Boulder Dash clone](https://boulders.netlify.app).

In that project, I used JSX together with [web components](https://www.webcomponents.org/). This way, web components start looking very similar to React class-level components, see my [game menu component](https://github.com/learosema/boulders/blob/main/src/game/components/game-menu.tsx).

A shortened version of this component is below:

```tsx
import { h, fragment, renderTree } from '../utils/jsx-factory';

export class GameMenu extends HTMLElement {

  static register() {
    customElements.define('game-menu', GameMenu);
  }

  gameMenu: HTMLDialogElement|null = null;
  menuButton: HTMLButtonElement|null = null;

  render() {
    const currentURL = document.location.href;
    renderTree(this,
      <>
        <button class="burger" aria-controls="gameMenu" aria-label="open menu"> 
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <rect x="1" y="1" width="14" height="3" />
            <rect x="1" y="6" width="14" height="3" />
            <rect x="1" y="11" width="14" height="3" />
          </svg>
        </button>
        <dialog class="game-menu flow" id="gameMenu">
          <h2>Menu</h2>
          <form method="dialog">
            <button id="buttonReturnToGame" class="button">Return to game</button>
          </form>
          <a href={currentURL} class="button">Restart game</a>
          <a href="/" class="button">Back to main menu</a>
        </dialog>  
      </>
    );
  }

  connectedCallback() {
    this.render();
    this.menuButton = this.querySelector<HTMLButtonElement>('.burger')!;
    this.gameMenu = this.querySelector<HTMLDialogElement>('.game-menu')!;
    this.menuButton.addEventListener('click', this.onClickButton);
  }

  disconnectedCallback() {
    this.menuButton?.removeEventListener('click', this.onClickButton);
    this.innerHTML = '';
  }

  onClickButton = () => this.gameMenu?.showModal();
}
```

The methods `connectedCallback` and `disconnectedCallback` are quite similar to the React lifecycle methods `componentDidMount` and `componentWillUnmount`.

One major difference to React is the fact I'm using `class` attributes rather than `className`. React chose to do so as `class` and `for` are reserved JavaScript keywords. Apparently, it works fine with `class` attributes so I prefer to stick to HTML as close as possible.

You could add certain transformations in your own JSX implementation to make both `class` and `className` work, but I decided to not do that.

I also kept the event handling separate and just went with using `addEventListener`. With some additional effort, we could also add support for adding event handlers in a declarative way, like React does.

## Setting up JSX for TypeScript

You can enable JSX for TypeScript by editing the `tsconfig.json` by setting a couple of options.

```json
{
  "jsx": "react",
  "jsxFactory": "h",
  "jsxFragmentFactory": "fragment",
}
```

There are multiple different types of JSX implementations. I'm using the legacy JSX factory implementation for now which was used in React up to version 16.

React version 17 introduced a new kind of JSX factory which I don't use yet. I will cover the differences of the old and new JSX in a follow-up article.

## Providing an implementation for the JSX factory

In order to make the JSX factory work, we need to provide implementations for the `h()` function and also for `fragment`.

Im my case, `h()` returns an object using a recursive `DOMTree` interface. It describes the structure of the generated JSX element.

```ts
export interface DOMTree {
  tagName: string;
  attribs: Record<string, string>,
  children: DOMTree[]
}
```

This way, the implementation for `h()` and `fragment` is pretty straightforward:

```ts
const svgNS = 'http://www.w3.org/2000/svg';

export const fragment = 'fragment';

export function h(
  tagName: string, 
  attribs: Record<string, string>, 
  ...children: DOMTree[]): DOMTree {
  return {
    tagName, attribs, children
  };
}
```

In a former version of my `h()` implementation, I created actual dom nodes directly via `document.createElement` instead of returning a data structure.

But in order to make inline SVG code work, it is important to switch to the XML namespace pointing to `http://www.w3.org/2000/svg` as soon as there is an `<svg>` tag, so my nodes need to know about their parent elements.

As a basic solution, I created a recursive `renderTree` function that takes care of that, using the `element.namespaceURI` property to retrieve the current XML namespace.

Additionally, support of fragments (using `<></>` in JSX) are made possible via the [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)-API.

```ts
const svgNS = 'http://www.w3.org/2000/svg';

/**
 * Render a DOM structure
 * 
 * @param node the container element where the DOM tree is appended to.
 * @param tree the DOM structure to be created
 */
export function renderTree(node: Element, tree: DOMTree) {
  const namespace = tree.tagName === 'svg' ? svgNS : node.namespaceURI;
  let el: Element|DocumentFragment;
  if (tree.tagName === fragment) {
    el = new DocumentFragment();
  } else {
    el = document.createElementNS(namespace, tree.tagName);
    for (const [attrib, value] of Object.entries(tree.attribs || {})) {
      el.setAttribute(attrib, value);
    }
  }
  for (const child of tree.children) {
    if (typeof child === "string") {
      el.appendChild(document.createTextNode(child));
      continue;
    }
    renderTree(el instanceof DocumentFragment ? node : el, child);
  }

  node.appendChild(el);
}
```

## Providing JSX type definitions

Finally, you need to declare a JSX namespace in a type declaration file, suffixed `.d.ts`.

Be careful with the naming of the files. When the factory is in `jsx.ts`, don't name the type definition file `jsx.d.ts` as there may be conflicts.

```ts
declare interface DOMTree {
  tagName: string;
  attribs: Record<string, string>;
  children: DOMTree[];
}

declare namespace JSX {
  interface Element extends DOMTree {}
  interface Attributes {
    [attrib: string]: string;
  }

  interface IntrinsicElements {
    [elem: string]: Attributes;
  }
}
```

## Final thought

A final thought I had when I was about to finish up this article was: can we also use it server-side?

You can make use of your web component code node.js by using ts-node. This way, you can use it in an express application or in a static site generator such as Eleventy. A nice buzzword for that would be "isomorphic typescript" 🥳.

When it comes to node applications, you often still work a lot with the `require()` notation for importing dependencies, aka the CommonJS module system (including Eleventy stable as of current). Importing a `.tsx`` file inside node is a bit trickier:

```js
require('ts-node').register({lazy: true, esm: false, moduleTypes: {
  'src/**/*.{ts,tsx}': 'cjs'
}});

// Then, you can use require with your typescript files:
const { h, fragment } = require('./src/utils/jsx.ts');
const { MyComponent } = require('./src/components/my-component.tsx');
```

For rendering the component server-side, you will need a DOM implementation. [JSDOM](https://github.com/jsdom/jsdom) or [LinkeDOM](https://github.com/WebReflection/linkedom) will do. I feel I should also write an in-depth article about this.
