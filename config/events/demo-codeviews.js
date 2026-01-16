import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import fm from 'front-matter';
import Prism from 'prismjs'

const CSS_PATH = './dist/assets/css/codeview.css';
const DEMOS_SRC_PATH = './src/demos';
const DEMOS_DIST_PATH = './dist/demos';

const escapeQuotes = str => str?.replace(/"/g, '&quot;');

const codeTemplate = (title, description, code, css, lang = 'markup') => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code view: ${title}</title>
  ${description ? `<meta name="description" content="${escapeQuotes(description)}">` : ''}
  <style>${css}</style>
</head>
<body>
  <h1>Code view: ${title}</h1>
  ${description ? `<p>${description}</p>`: ''}
  <pre class="language-markup"><code class="language-markup">${Prism.highlight(code, Prism.languages[lang], lang)}</code></pre>
</body>
</html>`.trim();

export default async function () {
  const css = await readFile(CSS_PATH, 'utf8');
  const files = await readdir(DEMOS_SRC_PATH);
  for (const file of files) {
    if (! file.endsWith('.html')) {
      continue;
    }
    const inputFile = path.join(DEMOS_SRC_PATH, file);
    const outputFileDir = path.join(DEMOS_DIST_PATH, file.replace(/\.html$/, ''), 'code');
    const outputFile = path.join(outputFileDir, 'index.html');
    const input = await readFile(inputFile, 'utf8');
    const {body, attributes} = fm(input);
    const title = attributes.title || 'Untitled';
    const description = attributes.description;
    try {
      await mkdir(outputFileDir, {recursive: true});
    } catch (err) {
      // ignore error.
    }
    await writeFile(outputFile, codeTemplate(title, description, body, css), 'utf8');
    console.error(`creating codeview for demo: ${file} -> ${outputFile}`);
  }
};
