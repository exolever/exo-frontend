const fs = require('fs-extra');
const concat = require('concat');

(async function build() {

  const files =[
    '../../dist/custom-elements/exo-exq/runtime.js',
    '../../dist/custom-elements/exo-exq/polyfills.js',
    '../../dist/custom-elements/exo-exq/main.js'
  ];

  await fs.ensureDir('../../dist/custom-elements/exo-exq');
  await concat(files, `../../dist/custom-elements/exo-exq/exq-component.js`);
  console.info('Web component created successfully!');

})();
