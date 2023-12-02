const path = require('path');
const {readFile} = require('fs/promises');
const vanillaH = require('vanillah');
const htm = require('htm');
const Prism = require('prismjs');
const fm = require('front-matter');
const slugify = text => text.trim().toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s/g, '-');

const arrowIcon = `<svg viewBox="0 0 72 72">
  <polygon fill="currentColor" stroke="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" points="35.134,14.0387 59.3629,13.1416 58.4658,37.3705 52.9078,37.1647 53.4324,23.0048 17.5399,58.8973 13.6073,54.9646 49.4998,19.0721 35.3399,19.5967"/>
</svg>`;

const tabs = ({title, selected = 'code', code, href}) => {
  const id = slugify(title);
  return `<div class="tabs">
  <div class="tabs__tablist | js" role="tablist">
    <button id="${id}--tab-html" class="tabs__tab" type="button" role="tab" aria-selected="${selected === 'code' ? 'true' : 'false'}" aria-controls="${id}--code">
      Code
    </button>
    <button id="${id}--tab-result" class="tabs__tab" type="button" role="tab" aria-selected="${selected === 'result' ? 'true' : 'false'}" aria-controls="${id}--result">
      Result
    </button>
  </div>
  <div class="tabs__panel" id="${id}--code" role="tabpanel" ${selected !== 'code' ? 'hidden':''}>
    ${code}
    <a href="${href}/code/" target="_blank">
      ${arrowIcon}
      <span id="${id}--code-link-accessible-name" class="visually-hidden">open in new window</span>
    </a>
  </div>
  <div class="tabs__panel | block-link" id="${id}--result" role="tabpanel" ${selected !== 'result' ? 'data-state="hidden"': ''}>
    <a href="${href}" target="_blank">
      ${arrowIcon}
      <span class="visually-hidden">open in new window</span>
    </a>
    <iframe src="${href}" title="${title}" loading="lazy"></iframe>
  </div>
</div>`
};

module.exports = async function ({document}) {
  const html = htm.bind(vanillaH(document));
  const anchors = document.querySelectorAll('.demo-figure__link a');
  const replaces = [];
  for (const anchor of anchors) {
    const href = anchor.getAttribute('href');
    const figure = anchor.parentNode.parentNode;
    const figcaption = figure.querySelector('figcaption');
    figcaption?.querySelector('a')?.remove();
    const codeSrc = path.join('src', href.slice(href.indexOf('/demos')) + '.html');
    const code = fm(await readFile(codeSrc, 'utf8')).body;
    const title = anchor.textContent.trim();
    const placeholder = `{{ code-${slugify(title)} }}`;
    const tabElement = html([tabs({title, code: placeholder, href})]);
    figure.insertBefore(tabElement, figcaption);
    const lang = 'markup';
    const prismCode = `<pre class="language-markup"><code class="language-markup">${Prism.highlight(code, Prism.languages[lang], lang)}</code></pre>`;
    replaces.push([placeholder, prismCode])
  }

  return (content) => {
    for (const [s, r] of replaces) {
      content = content.replace(s, r);
    }
    return content;
  }
};
