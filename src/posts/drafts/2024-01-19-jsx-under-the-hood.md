---
title: JSX under the hood
description: JSX is quite popular. Even beyond Frameworks like React, despite not being part of the JavaScript specification. Here's how JSX works.
---
In my last article, I wrote about how it is possible to use JSX beyond React. When it comes to JSX, there are frameworks other than React out there. SolidJS and Preact, to name a few. I covered how you can use JSX with Vanilla JS and the DOM API.

One thing I didn't quite touch is about what's happening under the hood.

As JSX is not part of JavaScript, it requires an additional transpile step in order to support it. This is done via a so-called transpiler. Here, you have a couple of options:

- [TypeScript](https://www.typescriptlang.org/docs/handbook/jsx.html)
- [ebuild](https://esbuild.github.io/content-types/#jsx)
- [vite](https://vitejs.dev/guide/features#jsx) (out of the box)

JSX is an extension which adds support for writing XML-like snippets directly into JavaScript. When it was revealed by Meta (facebook back then), there were mixed feelings coming from the JavaScript community.

On the one side, mixing markup into your JavaScript inline was considered a very bad practice, violating "separation of concerns". But on the other side, it apparently seemed to make sense in component-style JavaScript frontend frameworks. I remember an old article dated year 2015 on that by Eric Elliot back then, which quite shows the mixed feelings of it when it was introduced: [JSX looks like an abomination](https://medium.com/javascript-scene/jsx-looks-like-an-abomination-1c1ec351a918)


## JSX changed over time

