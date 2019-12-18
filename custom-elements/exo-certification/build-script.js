const fs = require('fs-extra');
const concat = require('concat');

(async function build() {

  const files =[
    '../../dist/custom-elements/exo-certification/runtime-es5.js',
    '../../dist/custom-elements/exo-certification/polyfills-es5.js',
    '../../dist/custom-elements/exo-certification/main-es5.js'
  ];

  await fs.ensureDir('../../dist/custom-elements/exo-certification');
  await concat(files, `../../dist/custom-elements/exo-certification/certification-component.js`);
  console.info('Web component created successfully!');

})();
