---
title: Alternatives to JSX
description: There are alternatives to JSX out there which which work without a build step
date: 2024-01-18
---
When it comes to client-side markup generation for component-driven web application development, JSX gained a lot of popularity due to the popularity of React.

In my blog article yesterday, I wrote about how to use JSX for client-side markup generation without using React. It's important to point out there are frameworks other than React you can use with JSX. In addition to that, I should have pointed out there are a lot more templating solutions other than JSX out there.

Let's do that.

## The template tag

The template tag is a modern html templating feature which is available in all major browsers.

The basic example is having a template tag and accessing it via JavaScript:

```js
<template id="my-paragraph">
  <p>My paragraph</p>
</template>
```

```js
let template = document.getElementById("my-paragraph");
let templateContent = template.content;
document.body.appendChild(templateContent);
```

### template and slots


### Usage with Web Components


### Declarative Shadow DOM



## Template Literals




## lit


## webc


## enhance
