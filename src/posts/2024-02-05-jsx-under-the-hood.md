---
title: JSX under the hood
description: JSX is quite popular. It gained popularity even beyond React, despite not being part of the JavaScript specification. So that made me write an article about how JSX works.
date: 2024-02-05
tags:
  - javascript
  - jsx
---
In my last article, I wrote about how it is possible to use JSX beyond React just with JavaScript and the DOM API. It is quite popular, as other frameworks adopted it. SolidJS, Astro and Preact, to name a few.

But I didn't really cover how it works under the hood, which also isn't covered in the official React documentation. So this article tries to catch that up.

## What's JSX at all?

It's an extension of the JavaScript specification (ECMA-262). Efforts to get this integrated into the official specification weren't successful so far, apparently.

## Transpiling JSX to JavaScript

As JSX is not part of JavaScript, it requires an additional transpile step in order to support it. This is done via a so-called transpiler. Here, you have a couple of options:

- [TypeScript](https://www.typescriptlang.org/docs/handbook/jsx.html)
- [ebuild](https://esbuild.github.io/content-types/#jsx)
- [vite](https://vitejs.dev/guide/features#jsx) (out of the box)

JSX is an extension which adds support for writing XML-like snippets directly into JavaScript. When it was introduced by Facebook and React, there were mixed feelings coming from the JavaScript community.

On the one side, mixing markup into your JavaScript inline was considered a very bad practice, violating separation of concerns. But on the other side, it apparently seemed to make sense in component-style JavaScript frontend frameworks. I remember an old article dated year 2015 on that by Eric Elliot back then, which quite shows the mixed feelings of it when it was introduced: [JSX looks like an abomination](https://medium.com/javascript-scene/jsx-looks-like-an-abomination-1c1ec351a918)

JSX gained a lot of popularity and so other frameworks adopted it.

## JSX changed over time

One thing that left me confused when I had a first look at React 17.

The team decided to the JSX processor so now there is a React-17 way and a React-pre-17 way to transpile JSX. TypeScript provides different transpile options, `react` for the pre-17 transpile and `react-jsx` for the transpile for versions 17 and up. That also is confusing and I always have to look up which is which.

## Pre-17-JSX

In React until version 16, JSX code used a createElement factory.
Imagine the following code:

```jsx
function GreeterComponent({name}) {
  return (
    <div>
      <h1>Hello {name}</h1>
      <p>Have a nice day!</p>
    </div>
  );
}
```

In React until version 16, it gets transpiled to

```js
function GreeterComponent({name}) {
  return React.createElement('div', null, 
    React.createElement('h1', null, `Hello ${name}`),
    React.createElement('p', null, 'Have a nice day!')
  );
}
```

In order to work with frameworks other than React, you can configure to use a JSX factory other than `React.createElement`. Commonly, `h` is used as a name:

```js
/* Transpilers like Babel support setting the JSX factory via an inline comment: */
/* @jsx h */

function GreeterComponent({name}) {
  return h('div', null, 
    h('h1', null, `Hello ${name}`),
    h('p', null, 'Have a nice day!')
  );
}
```

## React 17 and up

As mentioned, React 17 had a breaking change regarding JSX.

The same `GreeterComponent` now relies on an external `_jsx` helper. In theory, this can help decoupling JSX components from React so you don't need to import React anymore as a peer dependency anymore when building a component library (I'd appreciate that if that's the overall Roadmap but I'm not a React core team member).

The same GreeterComponent transpiled looks like this:

```js
function GreeterComponent({name}) {
  return _jsx('div', {children: [
    _jsx('h1', {children: [`Hello ${name}`]}),
    _jsx('p', {children: ['Have a nice day!']})
  ]})
}
```

One advantage of the breaking change is that it is more decoupled from React, as it doesn't rely on `React.createElement` by default anymore. Maybe it is as a try by the team to get this adopted into the ECMA-262 specification. One disadvantage is the breaking change, I'm not sure whether that would have been necessary or what the advantages are.

Maybe it's to make the syntax with the children property more similar to React's API.

The disadvantages of the breaking changes dominate my opinion about it. Codepen for example still has the React 16 transpilers in place. Also, there are libraries which didn't consider the breaking change and now you need glue code to make it work. So my feelings about it are quite mixed.

### Creating a data structure from JSX

In my last article, I used a very plain JSX factory which converts the JSX code into a basic JavaScript tree structure:

```js
function h(tagName, attributes, ...children) {
  return { tagName, attributes, children };
}
```

Alternatively, you could output JSDON. This could directly work with [linkedom](https://github.com/WebReflection/linkedom), a DOM API which could be used server-side. It is very performance-optimized and uses a linked-list data structure rather than a tree.

I like the idea of just having some JS objects describing components. However, one thought that did come to my mind was: it's over-engineered. I'm using a transpiler to convert an XML-like syntax into JavaScript just to output HTML. I could just use [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template?retiredLocale=de) instead.

## Further Resources

Paul Everitt has built an [Eleventy plugin for JSX](https://github.com/pauleveritt/eleventy-tsx) which looks pretty cool. I need to look into it.

Also, the official [React documentation](https://react.dev/learn/writing-markup-with-jsx) is worth a look.
