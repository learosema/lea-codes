---
title: An eleventy config for moving from Jekyll
date: 2026-01-15
description: a drop-in eleventy configuration to migrate from Jekyll to Eleventy.
tags:
  - eleventy
  - static-site
---
Sometimes I have a git repo just with documentation, consisting of markdown files.
Mostly on platforms like GitHub and alike.

A quick and dirty way to publish that to the web is to use [Jekyll](https://jekyllrb.com).
Github supports Jekyll out of the box, via GitHub Pages.

So, if you have markdown in your repository, you can make Github transform
it automatically to a website, with (almost) zero configuration.

You can provide your own design by HTML layout templates,
by adding a `_default/layout.html` and additional assets like css, similar to
Eleventy.

The experience for Jekyll is pretty user-friendly, even for non-developers.
Markdown is automatically transformed to HTML with zero configuration.

Moving off jekyll to Eleventy brings a couple advantages: it's super fast and adds
more flexibility, like adding additional post-processing, using CSS-preprocessors
like lightningcss, and it could probably make you more independent from GitHub.

To be fair, you can host Jekyll anywhere else, but
GitHub made it pretty configuration-free and straightforward.

Yes, to be fair, eleventy can do markdown configuration-free, too.

But one thing I needed to change was the URL handling, so it is more like in
Jekyll. Eleventy uses extension-free URLs, which are pretty cool. They are the best 
when it comes to end-user usability (shorter, human-readable URLs).
But that's not how Jekyll works.

In my markdown files, I often use several relative links to other markdown files.
Navigating these links from the github-repo-integrated file viewer works as well as
on the published jekyll site, where the links are rewritten as `.html` links.

I found this behaviour for my anchors pretty cool. I must admit this is
more a "developer experience" feature.

Anyways, a struggle to move off Jekyll to Eleventy could be a missing `eleventy.config.js`
which you can put into your repo and everything else works as before, without any changes.

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

## Isn't that a horrible advice?

Yes, this will make the URLs of your published site less readable.
At best, it's just an additional `.html` instead of a trailing
slash. At worst, it gets very long and sprinkled with 
hexacdecimal code sequences.

But the usability point about relative markdown links in the git platform's file
viewer is also valid.

In the end, it depends on your and your users' needs.

## "But I want the nicer URLs?"

If you want the best of both worlds, human-readable urls with trailing slash
in the published website, while keeping relative links to markdown documents, you can
do that, too.

You can keep the default permalink behaviour if you adjust the anchor manipulation post-processing accordingly.

Keep in mind that special characters are slugified by default. This means,
all non-alphabetic characters are replaced with hyphens. This avoids the URL to
look cryptic.

There's an NPM package for that. It's called slugify  (`slugify`).
But it's small enough to incorporate it into your build yourself, in case you struggle
to npm install it (because JavaScript dependency management is a mess).

A very minimal non-perfect slugify that works for plain english (ASCII characters only) is probably something like this:

```js
function slugify(str) {
  return str?.replace(/[\W]+/g,'-')
}
```

The anchor manipulation code then becomes like this. This splits the URL parts at the slashes and slugifies the path parts and then joins them together again.

```js
// the anchor manipulation code:
// Take the bigger code snippet from above and adjust the line with
// anchor.setAttribute accordingly.

anchor.setAttribute('href', 
  href.replace(/\.md$/, '/')
    .split('/')
    .map(str => slugify(str))
    .join('/'))
```

## EDIT: Misleading Title

For transparency: I originally named this
article "an eleventy config for moving from GitHub Pages" before.

This is a little misleading and baity, 
as [Kristof Zerbe](https://lea.lgbt/@kiko@indieweb.social) pointed out.
Also, as he mentioned, you can perfectly deploy an Eleventy site to GitHub.
So, this is more about Jekyll, not about moving away from GitHub.

I initially took this title because GitHub Pages integrated Jekyll so seamlessly.

People might resist changing to other platform where
they have to write an additional YAML file. So, this seamlessness could
be something that stops them for migrating away from GitHub.
