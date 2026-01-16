---
title: Eleventy: Autopopulating the title variable from the template
date: 2026-01-16
tags:
  - eleventy
  - static-site
---
One very common way to provide a title in Eleventy is by using frontmatter data inside
the template.

For example, this looks like in the following code snippet:

```md
---
title: Hello world!
---
# {{ title }}

Lorem ipsum is a pretty cool dummy text dolor sit amet.
```

Sometimes, I want to provide the title by just adding an h1 to my markdown.
It's less verbose:

```md
# Hello World!

Lorem ipsum is a pretty cool dummy text dolor sit amet.
```

This has the downside that there is no title variable
populated which I can reuse to fill my `<title>` tag in my
layout file.

So, I found a way to make that work via an eleventyComputed.
Since version 3, eleventy provides the raw input in the
[eleventy supplied data](https://www.11ty.dev/docs/data-eleventy-supplied/).

The raw input is the unprocessed unparsed template body
minus the template's frontmatter.

So, you can provide a computed title variable.
In case of markdown, it is parsed via a regular expression, in case of HTML,
linkedom is used (a fast DOM parser API):

```js
import { parseHTML } from 'linkedom'

eleventyConfig.addGlobalData("eleventyComputed.title", () => {
  return (data) => {
    if (data.page.inputPath?.endsWith('.md')) {
      const titleRegex = /^\#\s(.*?)\r?\n/;
      const match = data.page.rawInput?.match(titleRegex);
      return match ? match[1] : '';
    }
    return '';
  }
})
```

This only works for markdown though. In theory, you could also handle
other formats, for example HTML.

```js
import { parseHTML } from 'linkedom'

/* ... */
if (data.page.inputPath?.endsWith('.html')) {
  const { document } = parseHTML(data.page.rawInput);
  return document.querySelector('title').textContent;
}
```

In my use-case, handling markdown inputs was sufficient.
