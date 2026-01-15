---
title: An eleventy config for moving from GitHub Pages
date: 2026-01-15
description: a drop-in eleventy configuration to migrate from Jekyll to Eleventy.
tags:
  - eleventy
  - static-site
---
Sometimes I have a git repo just with documentation, consisting of markdown files.
Mostly on platforms like GitHub and alike.

A quick and dirty way to publish that to the web is to use Jekyll.
Github supports Jekyll out of the box, via GitHub Pages.

So, if you have markdown in your repository, you can make Github transform
it automatically to a website, with (almost) zero configuration.

You can provide your own design by HTML layout templates,
by adding a `_default/layout.html` and additional assets like css.

The experience for Jekyll is pretty user-friendly, even for non-developers.
Markdown is automatically transformed to HTML with zero configuration.

Moving off jekyll to Eleventy brings a couple advantages: it's super fast and adds
more flexibility, like adding additional post-processing, using CSS-preprocessors
like lightningcss, and it makes you maybe more independent from GitHub.

To be fair, you can host Jekyll anywhere else, but
GitHub made it pretty configuration-free and straightforward.

Yes, to be fair, eleventy can do markdown configuration-free, too.

But one thing I needed to change was the URL handling to be more like Jekyll.
Eleventy uses extension-free URLs, wich are pretty cool. They are the best whem
it comes to end user usability (shorter, human-readable URLs). But that's not how
Jekyll works.

In my markdown files, I often use several relative links to other markdown files.
Navigating these links from the github-repo-integrated file viewer works as well as
on the published jekyll site, where the links are rewritten als `.html` links.
I found this behaviour for my links pretty cool. I must admit this is
more a "developer experience" feature.

Anyways, a struggle to move off Jekyll to Eleventy could be a missing `eleventy.config.js`
which you can put into your repo and everything else works without any changes.

So, this is what i did:

First, I changed the global permalink settings to use "resource mode", like documented
in the [eleventy documentation](https://www.11ty.dev/docs/permalinks/#remove-trailing-slashes)
Disclaimer: this is usually not recommended, the extension-free URLs are the
user-friendlier ones.

So, maybe refactor later? 🙈

Then, I used `linkedom` to process my HTML output.
It's a lightweight DOM implementation which let's me parse HTML and manipulate it
with DOM APIs, just like in the browser's JavaScript environment.

So I can loop through all anchor tags, via `document.querySelectorAll` and handle all
relative links with a `.md` ending and replace it with `.html`, like Jekyll does it.

The eleventy setup:

```sh
npm init -y
npm i @11ty/eleventy -D
npm i linkedom
```

The resulting `eleventy.config.js`:

```js
import { parseHTML } from 'linkedom';

export default function (eleventyConfig) {

  eleventyConfig.addGlobalData('layout', () => 'default.html')
  // Set global permalinks to resource.html style
  eleventyConfig.addGlobalData("permalink", () => {
    return (data) =>
      `${data.page.filePathStem}.${data.page.outputFileExtension}`;
    });

    eleventyConfig.addTransform('remap-md-links', function (content) {
    if (((this.page.outputPath || "").endsWith(".html")) === false) {
      return content;
    }
    const { document } = parseHTML(content);
    const isRelativeLink = (href) => /^https?:\/\//.test(href) === false;
    const anchors = document.querySelectorAll('a[href]')
    for (const anchor of anchors) {
      const href = anchor.getAttribute('href') || ''
      if (isRelativeLink(href) && href.endsWith('.md')) {
        anchor.setAttribute('href', href.replace(/\.md$/, '.html'))
      }
    }
    return document.toString();
  })

  return {
    dir: {
      input: '.',
      includes: "_includes",
      layouts: "_layouts",
      output: 'dist',
    }
  }
}
```

Then build with `npx eleventy` or watch and serve with `npx eleventy --serve`.
