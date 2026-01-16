import syntaxHighlightPlugin from '@11ty/eleventy-plugin-syntaxhighlight';
import rssPlugin from '@11ty/eleventy-plugin-rss';
import { EleventyRenderPlugin } from '@11ty/eleventy';

import esbuildPlugin from './config/plugins/esbuild.js';
import lightningCSSPlugin from './config/plugins/lightning-css.js';
import htmlTransformPlugin from './config/plugins/html-transform.js';
import imagePlugin from './config/plugins/image.js';
import demoPlugin from './config/plugins/demo.js';

import { filterPlugin } from './config/filters/index.js';

// module import events
import { svgToJpeg, demoCodeviews } from './config/events/index.js';

export default (eleventyConfig) => {
  // custom watch targets
  eleventyConfig.addWatchTarget('./src/assets');

  // plugins
  eleventyConfig.addPlugin(syntaxHighlightPlugin);
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(esbuildPlugin);
  eleventyConfig.addPlugin(lightningCSSPlugin);
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(htmlTransformPlugin);
  eleventyConfig.addPlugin(imagePlugin);
  eleventyConfig.addPlugin(demoPlugin);

  // filters
  eleventyConfig.addPlugin(filterPlugin);

  // short codes
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`); // current year, stephanie eckles

  // passthrough copy
  // same path
  ['src/assets/fonts/', 'src/assets/images/'].forEach((path) =>
    eleventyConfig.addPassthroughCopy(path)
  );

  // social icons to root directory
  eleventyConfig.addPassthroughCopy({
    'src/assets/images/favicon/*': '/',
  });

  eleventyConfig.addPassthroughCopy({
    'src/assets/css/global.css': 'src/_includes/global.css',
  });

  // build events
  eleventyConfig.on('eleventy.after', () => {
    svgToJpeg();
    demoCodeviews();
  });

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  eleventyConfig.setUseGitIgnore(false);

  return {
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      output: 'dist',
      input: 'src',
      includes: '_includes',
      layouts: '_layouts',
    },
  };
};
