---
title: "Eleventy: Autopopulating the title variable from the template"
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
title: Hello World
---
# {{ "{{ title }}" }}

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

## Using an eleventyComputed variable as title

So, I found a way to make that work via an eleventyComputed.
Since version 3, eleventy provides the raw input in the
[eleventy supplied data](https://www.11ty.dev/docs/data-eleventy-supplied/).

The raw input is the unprocessed unparsed template body
minus the template's frontmatter.

So, you can provide a computed title variable.
When the input file format is markdown, it is parsed via a regular expression:

```js
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

## Further considerations

This is specific to markdown though. Also, it isn't perfect.
Further formatting inside the h1 isn't processed.

You could add that with a few further regular expressions, like I did with my
non-complete [mini-markdown implementation](https://github.com/sissijs/sissi/blob/main/src/transforms/markdown.js), or just use a complete markdown parser like
`markdown-it` at that point :). Somehow I refuse to do that because
Eleventy already does that at the template processing point, as that could have a
bigger performance impact.

## Other formats and advanced use-cases

For other formats and/or more advanced use-cases,
you could also combine it with an HTML parser,
like [linkedom](https://github.com/WebReflection/linkedom).
I'm in love with that library; it's great for
server-side HTML processing.

```js
import { parseHTML } from 'linkedom'

/* ... */
if (data.page.inputPath?.endsWith('.html')) {
  const { document } = parseHTML(data.page.rawInput);
  return document.querySelector('title').textContent;
}
```

In my use-case, handling the markdown headline with the
above regex was sufficient.

## Why?

This was a side-quest for my try to migrate a site from Jekyll to Eleventy which
provided the title via a single hash sign (`#`). While Jekyll populated the
title variable from it, Eleventy didn't do this (subtle feature request? ☺️)
