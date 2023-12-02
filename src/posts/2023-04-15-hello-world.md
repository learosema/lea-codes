---
title: Hello World!
description: Hello world, this is my new blog, a place to write for me.
tags: 
  - introduction
  - eleventy
date: 2023-04-15
---
Hello world, this is my new blog, a place to write for me.

It is based on [eleventy-excellent](https://github.com/madrilene/eleventy-excellent) by [Lene Saile](https://lenesaile.com). I learned a lot of new things by studying her work. It's indeed excellent.

## Learnings

- Kudos to [Andy Bell](https://andy-bell.co.uk) and his talk about [building excellent websites that just work for everyone](https://buildexcellentwebsit.es/).
- You can organize your eleventy configurations by splitting them up in multiple config javascript files
- CSS and JS as first-class citizens in Eleventy
- All the SEO stuff, this is really great. It was also a bit overwhelming to me as I never really had in-depth touch points with SEO
- Kudos also to the [SEO Cheat sheet by 9elements](https://seo-cheat-sheet.9elements.com/), it helped me a lot getting the basics.
- Using pseudo random numbers in Eleventy where you provide a seed and always get the same sequence of random numbers.
- Reset CSS by [Elly loel](https://gist.github.com/EllyLoel/4ff8a6472247e6dd2315fd4038926522)
- lowering specificity with `:where`
- I learned about CSS Layers, making lowering specificity with `:where` not necessary anymore 😅
- There's this new rust-based [lightningcss](https://lightningcss.dev) which can minify, autoprefix according to a browserslist :)

## Things left to improve

1. The theme switcher is based on JavaScript, the fallback for now is to not provide theme options but respect the user's color scheme preferences. Also, this can cause a flash in the first contentful paint so a server-side solution might be better (there's an Eleventy Edge example I have to look into).

2. Automatic accessibility checks. There's a netlify plugin I didn't manage to get working yet.

3. I didn't get too comfy with Tailwind and using that as design tokens yet.
