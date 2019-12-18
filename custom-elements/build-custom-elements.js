const { readdirSync } = require('fs');
const { exec } = require('child_process');
const path = require('path');

// TODO concatenar el directorio actual con el parámetro

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => `${__dirname}/${dirent.name}`);

const buildCustomElement = directory => {
  var source_name = process.env.SOURCE_NAME;
  var dirname = path.basename(directory);
  exec(`cd ${directory} && npm install && ng lint && ng build --prod --output-hashing none --deploy-url=https://cdn.openexo.com/bundles/exo-frontend/${source_name}/custom-elements/${dirname}/ && node build-script.js && cd ..`, (err, stdout, stderr) => {
    console.info(`\n***** START building ${directory} custom element *******\n`);
    if (err) {
      console.error(directory, err)
      process.exit(1);
    } else {
      console.info(`stdout(${directory}): ${stdout}`);
    }
    console.info(`\n***** END building ${directory} custom element *******\n`);
  });
}

getDirectories('./').forEach(directory => buildCustomElement(directory));
