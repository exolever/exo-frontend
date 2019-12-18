const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    '../../dist/custom-elements/exo-event-list/runtime.js',
    '../../dist/custom-elements/exo-event-list/polyfills.js',
    '../../dist/custom-elements/exo-event-list/main.js'
  ];
  const random = Date.now();

  console.info('Creating exo-event-list custom element...');
  await fs.ensureDir('../../dist/custom-elements/event-list-component.js');
  await concat(files, '../../dist/custom-elements/exo-event-list/exo-event-list.js');
  console.info('<exo-event-list></exo-event-list> custom element created successfully!');
})();
