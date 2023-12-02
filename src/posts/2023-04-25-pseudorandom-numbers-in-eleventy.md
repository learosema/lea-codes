---
title: Pseudorandom numbers in Eleventy
description: Create deterministic series of random numbers for generative arts
tags:
  - eleventy
  - numbers
---
This blog uses social preview images with some generative waves using the [disability pride flag colors](https://www.disabled-world.com/definitions/disability-pride.php). In order to always have the same wave art on every build, I am not using `Math.random()` to generate
random path coordinates but a pseudorandom number generator. It generates a deterministic series of numbers from a given seed value. This way it is ensured every build always generates the same image.

A common JavaScript implementation for pseudorandom numbers is available in a [gist by @blixt](https://gist.github.com/blixt/f17b47c62508be59987b).

I wanted to use that in Eleventy, so I added a [prng.js](https://github.com/lea-lgbt/blog/blob/main/src/_data/prng.js) file inside my data directory. 

`prng` provides a `prng.init(12345)` function to provide a seed value, which you can use from Nunjucks/Liquid via double brackets.

To generate random numbers, prng.js provides a `random` function and also a `randInt` function.

- `random` generates float values between 0 and 1 (exclusive 1).
- `randInt(a, b)` generated integer values between a and b (inclusive b)
- `curve()` is a method to generate a bunch of random coordinates for SVG curve paths.

There is one little pitfall with this. `random` is an impure function, which means it is not purely dependant on function parameters but relies on a variable outside the function scope. Before I implemented `prng.init` as a function, it was just a property. But there's a special thing when using Eleventy as a dev server: it keeps the internal state of variables between builds. Using a function instead to initialize the seed value ensures the seed value is always initialized with the desired value on every build.

In order to provide the seed from frontmatter data, it is required to pass that also to the `prng.init` function.

The code for generating the waves is [here](https://github.com/lea-lgbt/blog/blob/main/src/social-preview.njk).

The result looks like this:

![Social preview Image of my blog. It is titled "Lea's Blog" in bold white letter on a black background. In the bottom of the image, there is a waves art in disability pride colors.](https://blog.lea.lgbt/assets/images/social-preview/default.jpeg)

The process for auto-generating the preview images is described in detail by [Bernard Nijenhuis](https://bnijenhuis.nl/notes/automatically-generate-open-graph-images-in-eleventy/) and also integrated into [eleventy-excellent](https://github.com/madrilene/eleventy-excellent) by [Lene Saile](https://www.lenesaile.com/en/).
