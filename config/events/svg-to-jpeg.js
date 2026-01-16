// https://bnijenhuis.nl/notes/automatically-generate-open-graph-images-in-eleventy/
// concerts SVG to JPEG for open graph images

import Image from '@11ty/eleventy-img';
import { glob } from 'glob';
import path from 'path';

export default async function () {
  const socialPreviewImagesDir = 'dist/assets/images/social-preview/';
  const files = await glob([path.join(socialPreviewImagesDir, '*.svg'), path.join(socialPreviewImagesDir, '**/*.svg')]);
  if (!files || files.length === 0) {
    console.log('⚠ No social images found');
    return;
  }
  for (const inputFileName of files) {
    const outputDir = path.dirname(inputFileName);

    Image(inputFileName, {
      formats: ['jpeg'],
      outputDir,
      filenameFormat: function (id, src, width, format, options) {
        const outputFileName = `${path.basename(inputFileName)}`.replace(/\.svg$/, `.${format}`);
        return outputFileName;
      },
    });
  }


};
