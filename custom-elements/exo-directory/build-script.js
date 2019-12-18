const fs = require('fs-extra');
const concat = require('concat');

(async function build() {

  const files =[
    '../../dist/custom-elements/exo-directory/runtime.js',
    '../../dist/custom-elements/exo-directory/polyfills.js',
    '../../dist/custom-elements/exo-directory/main.js'
  ];

  await fs.ensureDir('../../dist/custom-elements/exo-directory');
  await concat(files, `../../dist/custom-elements/exo-directory/directory-component.js`);
  console.info('Web component created successfully!');

})();
