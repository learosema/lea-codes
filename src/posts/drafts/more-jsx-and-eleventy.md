https://github.com/pauleveritt/eleventy-tsx

# Framework-agnostic JSX

JSX is often used in combination with React. In a former article, I wrote about how JSX works under the hood, and that it can be used without the React ecosystem in the world of web components.

But, can it be used in a framework-agnostic way?
Well, you can absolutely use native web components in any framework.

But there is also another approach which is also worth a look. We can use JSX inside a library without specifying what framework we are going to use.

This way, JSX is more or less a JS-driven template data structure which could hold the schematics of a component plus its event handlers.

It would allow to re-use the component in different environments, like in a React app as well as in a server-side node.js application.

We wouldn't even need Stencil for it.

However, one thing we do need to get JSX working is an additional transpile step to get JSX compiled to JS.

Choices are esbuild, swc and/or TypeScript. It will also work with Babel.

TODO example

## Alternative

The HTML `<template>` tag is awesome and pretty powerful. Also, a helpful thing that has been around for a while is `DOMParser`. TBD
