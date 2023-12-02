const { readFile } = require('fs/promises');
const meta = require('../../src/_data/meta');
const path = require('path');
const fm = require('front-matter');

const figureTemplate = ({src, title, description}) => `
<figure class="demo-figure">
  <div class="demo-figure__link">Demo: <a href="${src}">${title}</a></div>
  <figcaption>
    <cite>${description}</cite>
    <a href="${src + '/code/'}">view code</a>
  </figcaption>
</figure>
`.trim();


module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode('demo', async (src) => {
    const localPath = path.join('./src/demos', src + '.html');
    const content = await readFile(localPath, 'utf8');
    const {attributes} = fm(content);
    const fullSrc = meta.url + '/demos/' + src;
    return figureTemplate({
      src: fullSrc,
      title: attributes.title || 'Untitled',
      description: attributes.description || 'No description provided'
    });
  });
};
