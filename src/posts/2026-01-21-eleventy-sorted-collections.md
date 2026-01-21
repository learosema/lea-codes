---
title: "Eleventy: Sorted Collections"
date: 2026-01-21
tags:
  - eleventy
  - static-site
---
Ever wanted to have more control over how your Eleventy collections are sorted?
By default, Eleventy sorts collection items by date. This is a perfect default for
blog sites.

Right now, I'm building more of a knowledgebase/book kind of thing.
And `date` is not the most important criteria to sort all articles.
Though, it's still useful to display the most recent edited articles at some place.

Nevertheless, I wanted my collection to be the in the same
order as they occur in my table of content file.
Which happens to be the root `src/index.md`
in my case.

Also, I didn't want to maintain the order by frontmatter or additional json data.

This is why I built something that parses the file and
creates a sorted collection from `collection.all`,
sorted by occurrence in my TOC file:

```js
async function createSortedCollection(eleventyConfig) {
  const src = await readFile('src/index.md', 'utf8');
  const linkRegex = /\[.*?\]\((.*?)\)/g;
  const hrefs = ['./src/index.md'];
  let m;
  while ((m = linkRegex.exec(src)) !== null) {
    if (m[1]?.startsWith('https://') === false) {
      const file = './src/' + m[1];
      hrefs.push(file);
    }
  }
  eleventyConfig.addCollection("toc", function (collectionsApi) {

  return collectionsApi.getAll()
    .filter(a => hrefs.indexOf(a.inputPath) >= 0)
    .sort(function (a, b) {
      const aIndex = hrefs.indexOf(a.inputPath)
      const bIndex = hrefs.indexOf(b.inputPath)
    
    return aIndex - bIndex
  });
 });
}
```

## How to use this?

You can add this to the Eleventy config via `eleventyConfig.addPlugin(createSortedCollection)`.

Then, I can put "previous" and "next" links onto my pages.

I use this on a german study site where I prepare myself for a certification,
the Certified Professional User Experience, Foundation Level. I had the need to transfer it to a simpler-language version and provide it in HTML. There's a PDF for learning, but I failed learning from it, due to complex sentences and me being demotivated quickly when
dealing with PDFs.

The site is <https://learosema.github.io/cpux-prep/>, in german. The little prev next links at the bottom of the page are driven by the above TOC collection:

<https://github.com/learosema/cpux-prep/blob/main/src/_layouts/default.njk#L35>

## Caveats

This is not a one-fits-all solution and probably needs some work to make it one.
But that's fine for me, as of current. It doesn't need to be a one-fits-all-solution.
YAGNI maybe.

Also, one tricky part is getting from the hrefs to something that identifies the items in the collection correctly. I used the inputPath and prepended my base directory to the `href`. Also, my URLs in the TOC are all relative. I use a custom permalink setting where I just do relative links to markdown files which are post-processed from .md to .html afterwards :).

In the default eleventy config, this needs to be adjusted. You could
use the `filePathStem` property and prepend the base URL there.

It can only handle markdown and the path to the TOC file is hardcoded.

To make it more agnostic to the inut file format, you could process the input once and
then process the output html file via a DOM parser library.

Have I mentioned that I find [linkedom](https://github.com/WebReflection/linkedom) pretty great
for server-side HTML processing tasks?

## Resources

- [Eleventy documentation, Collections API](https://www.11ty.dev/docs/collections-api/)
