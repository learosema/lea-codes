import path from 'path';
import { readFile } from 'fs/promises';
import vanillaH from 'vanillah';
import htm from 'htm';
import Prism from 'prismjs';
import fm from 'front-matter';
const slugify = text => text.trim().toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s/g, '-');

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
  </div>
  <div class="tabs__panel | block-link" id="${id}--result" role="tabpanel" ${selected !== 'result' ? 'data-state="hidden"': ''}>
    <iframe src="${href}" title="${title}" loading="lazy"></iframe>
  </div>
</div>`
};

export default async function ({document}) {
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
