---
title: Automated workflows for websites
description: In this article, I'm writing about automated workflows I added to this blog.
tags: 
  - eleventy
  - ci
date: 2023-04-20
---
A thing I did recently was adding some automated workflows to my blog so I can be sure my HTML, CSS, JS is valid and everything respects the editorconfig.

I also added linkedom for dom-like html transforms.

Credits for the automated checks and transforms go to [Vadim Makeev](https://pepelsbey.dev)

## HTML Validator

For validating HTML, I'm running the [Nu HTML Validator](https://validator.w3.org/nu/) against the dist directory. Validating HTML helps catching mistakes I might have otherwise missed. It also catches some accessibility bugs, like an `aria-labelledby` pointing to an invalid id.

I installed it via `npm i -D vnu-jar` and added an npm script for checking the html:

```json
{
  "scripts": {
    "lint:html": "java -jar node_modules/vnu-jar/build/dist/vnu.jar --skip-non-html --filterfile .vnurc dist"
  }
}
```

In the filter file, you can specify regular expressions to ignore certain errors. I added the role about adding the list role on unordered lists, because Safari removes the role it when you add `list-style: none` to the css.

```txt
The .list. role is unnecessary for element .ul.\.
```

This [GitHub action](https://github.com/lea-lgbt/blog/blob/main/.github/workflows/lint-html.yml) executes these check on every commit.

## Post-processing HTML

This blog is built with [eleventy](https://11ty.dev). Eleventy provides [transforms](https://www.11ty.dev/docs/config/#transforms) as a way to post-process your output files.

In order to efficiently work with HTML, it would be cool to have a familiar API for manipulating the HTML structure, like a DOM API. A popular one for this use-case is JSDOM. I'm using [Linkedom](https://webreflection.medium.com/linkedom-a-jsdom-alternative-53dd8f699311) which has basically the same API but is more lightweight and also faster. Additionally, it provides possibilities to serialize dom trees to JSON, which is nice.

The flow for post-processing the HTML is to parse the HTML output via Linkedom, which returns a dom object where I can do all the things I know from browserland-JavaScript like `dom.document.querySelector` or `dom.document.appendChild`. Afterwards, I can return it back as HTML via `document.toString()`.

The code for this is here: [HTML transform configuration for Eleventy](https://github.com/lea-lgbt/blog/blob/main/config/plugins/html-transform.js)

For now, I just added a transform that adds ids for headlines, making headlines and sub-headlines linkable. Another potential use case for this kind of transforms is to also add additional automated accessibility checks. Check the document structure, test if everything has accessible names and check image descriptions, for example.

Another missing feature I plan to add through this is the recognition of external links and maybe open them in a new tab (I'm a bit divided on this, but when I do, I should also convey the information the link opens a new tab).

## ESLint

ESLint is a tool to check my JavaScript code for common pitfalls. The configuration is pretty straightforward.
All I did here was to `npm install eslint`, provide a [basic configuration](https://github.com/lea-lgbt/blog/blob/main/.eslintrc.yml) file and add an npm script to my `package.json`:

```json
{
  "scripts": {
    "lint:js": "eslint eleventy.config.js src/assets/js"
  }
}
```

Additionally, I've set up a [GitHub action](https://github.com/lea-lgbt/blog/blob/main/.github/workflows/lint-js.yml) for it which is run on every pull request and push to main.

## Stylelint

Same as above for stylelint. I'm using a minimalistic stylelint configuration to avoid the most common pitfalls. I have to find out for myself which configuration works best for me. For now I went with `stylelint-config-recommended` and I have also set up a [github action](https://github.com/lea-lgbt/blog/blob/main/.github/workflows/lint-css.yml) for this.

## Semantic Release

I'm using [semantic-release](https://semantic-release.gitbook.io) for version management. It automatically takes care of creating release download files and adding git tags.

To use it, it assumes a certain commit message structure. According to prefixes, version numbers are counted up and every release is shown on the GitHub repo page of this blog, including a Changelog in the description.

Fixes (all commits prefixed with `fix:`) lead to a minor version upcount. Features (all commits prefixed with `feat:`) lead to a middle version upcount. If you add "BREAKING CHANGE" to the commit description, this leads to a major version upcount. When doing a breaking change, also provide upgrade information in the breaking change.

For now, I just publish to GitHub, not to NPM (thus the `private` field in the `package.json`).

To set it up, all I had to do was to `npm i -D semantic-release`, setup the repository URL in the `package.json`, setup a [github action](https://github.com/lea-lgbt/blog/blob/main/.github/workflows/release.yml) and set the permissions for actions inside my organization to read/write access.

I mainly used semantic-release for library code, not for websites yet. So this is more of an experiment, I don't know yet if it is too useful.

## Further improvement

Of course, there is room for further improvement. One thing to look into are automated accessibility checks out there, like [pa11y](https://pa11y.org/).
There's a lot of stuff I have to experiment with and figure out what works best for me. Especially the html validation was very insightful and helped identifying some issues in the document structure, but I might not need it on every commit.
