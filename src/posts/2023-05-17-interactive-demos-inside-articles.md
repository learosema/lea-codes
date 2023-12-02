---
title: Interactive demos inside articles
description: This article touches how I embed interactive code demos into my blog articles.
date: 2023-06-01
tags:
  - eleventy
  - javascript
  - meta
---
I wanted to embed demo snippets of html/css/js into my articles, so I added a `{% raw %}{% demo "demo-name" %}{% endraw %}` shortcode to my Eleventy blog. Those demos are just plain html files located in `src/demos`, with everything inline, with the html skeleton provided by Eleventy.

As `<style>` tags would then be put into the body, I added a html transform rule which moves those `<style>` tags from `<body>` to `<head>`. Although browsers seem to tolerate style tags inside `<body>`, it would not be valid HTML.

Those html transforms are processed in my Eleventy project at build time using [linkedom](https://github.com/WebReflection/linkedom), which is a lightweight and fast DOM implementation. The [code](https://github.com/lea-lgbt/blog/blob/main/config/plugins/html-transform.js) for it is put into a separate eleventy config file which can be loaded into the main configuration file via `eleventyConfig.addPlugin`.  

Using LinkeDOM is pretty straightforward, you have a `parseHTML` function where you pass-in a string of HTML code and you will get a DOM API back to work with, containing `{ document, customElements }` and more.

So, moving a style tag from head to body on the server-side looks similar to how you would do it in browser-side JavaScript:

```js
// Moves style tags from body up to the head.
module.exports = function ({document}) {
  document.body.querySelectorAll('style').forEach(style => {
    style.remove();
    document.head.appendChild(style);
  });
};
```

For embedding the demos into my articles, I used a tab widget inside a `<figure>` element, but that widget shouldn't be included into the rss feed, so I only put links to the demos and added a transform rule which adds the tab widget into the blog articles on the website.

The tab widget follows the pattern of the [Example of Tabs with Manual Activation](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-manual/) of the ARIA Authoring Practices Guide (APG).

Below is an example of such a demo embed.

{% demo "hello-world" %}

In a next iteration, I could maybe separate the code into HTML/CSS/JS tabs, similar to what you know from embeds like Codepen or jsfiddle.

## The code

This needs some clean up, I could imagine putting that into an Eleventy plugin. Right now it's sprinkled over all of the code base, but I coded that while I was in hospital during my awake times, only having my iPad with me, laying most of the time in a sickbed.

{% image "sickbed-coding.jpg", "A sickbed in a hospital with dim lighting. There is a bed-table with an iPad and some headphones on top. The app Working Copy is opened, which is a git client with an integrated text editor with syntax highlighting for iOS." %}

Links to the code:

- [Layout file for demos](https://github.com/lea-lgbt/blog/blob/main/src/_layouts/demo.njk)
- [Eleventy demo-Shortcode for inserting figures with link and description](https://github.com/lea-lgbt/blog/blob/main/config/plugins/demo.js)
- [Inserting tab widgets into the figures at Eleventy build time](https://github.com/lea-lgbt/blog/blob/main/config/transforms/demo-embeds.js)
- [Creating Source Code views (mainly in order to have something like view-source links that also work on iPad)](https://github.com/lea-lgbt/blog/blob/main/config/events/demo-codeviews.js)
- [Clientside JS for the tab widget](https://github.com/lea-lgbt/blog/blob/main/src/assets/js/tabs.js)
