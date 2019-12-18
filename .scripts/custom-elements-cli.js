const fetch = require('node-fetch');
const inquirer = require('inquirer');
const ora = require('ora');
const detect = require('detect-port');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const promisedHandlebars = require('promised-handlebars');
const Handlebars = promisedHandlebars(require('handlebars'));
const concurrently = require('concurrently');

const SCRIPT_URL = 'http://localhost:8000/static/scripts/custom-elements.js';

function cleanupScripts() {
  const scriptPath = path.resolve(__dirname, '../src/assets/custom-elements.js');
  shell.exec(`rm ${scriptPath}`);
}

function createCustomElementInjectionScript() {
  const template = fs.readFileSync(path.resolve(__dirname, 'template', 'custom-elements.hbs'), 'utf-8');
  return Handlebars.compile(template);
}

function ngServe() {
  concurrently([
    'npm run start:cli-proxy',
    'npm run start:element'
  ], { killOthers: true, raw: true }).then(
    () => {
      console.log('Complete');
    },
    () => {
      console.log('Something went wrong');
      console.log('Logging node processes. Please close any persisting processes manually.');
      shell.exec('ps | grep node');
    });
}

function checkDevServer(port) {
  return detect(port)
    .then(result => result !== port);
}

function checkFileExists(port, filename) {
  return fetch(`http://localhost:${port}/${filename}.js`, {
    method: 'GET',
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  })
    .then(res => res.text())
    .then(file => file && file.length)
    .catch(() => false);
}

function toPrettyPath(fullPath) {
  return fullPath.substr(0, fullPath.indexOf('.'));
}

function extractComponentNames(componentPath) {
  return componentPath
    .replace(/'/g, '')
    .replace('\n', '')
    .replace(/%s/g, '')
    .trim();
}

function prependDomains(componentList, targetComponent, port) {
  return componentList.map(path => {
    if (toPrettyPath(path) === targetComponent) {
      return `http://localhost:${port}/${toPrettyPath(path)}.js`;
    }
    return `http://localhost:8000/static/scripts/${path}`
  });
}

async function getComponentList() {
  const spinner = ora('Fetching component list...').start();
  return fetch(SCRIPT_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  })
  .then(data => data.text())
  .then(payload => {
    const arrayValues = payload.match(/(?<=\[).+?(?=\])/gs);
    spinner.succeed('Fetch complete');
    return arrayValues[0].split(',').map(extractComponentNames);
  });
}

function getUserInput(componentList) {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'targetComponent',
        choices: () => componentList.map(toPrettyPath)
          .filter(el => el !== ''),
        message: 'Which component do you want to develop?'
      },
      {
        type: 'input',
        name: 'port',
        default: 8080,
        message: 'Which port is your React component running on?'
      }
    ]);
}

(async function() {
  const componentList = await getComponentList();
  cleanupScripts();

  getUserInput(componentList)
    .then(async answers => {
      const { port, targetComponent } = answers;
      const isDevServerRunning = await checkDevServer(port);
      const fileExists = await checkFileExists(port, targetComponent);

      if (!isDevServerRunning) {
        console.log(`No webpack-dev-server detected on localhost:${port}`);
        process.exit(0);
      }

      if (!fileExists) {
        console.log(`${targetComponent} not found on localhost:${port} \n Are you sure it's the correct component?`);
        process.exit(0);
      }

      const script = await createCustomElementInjectionScript()({ components: prependDomains(componentList, targetComponent, port) });

      fs.writeFile(path.resolve(__dirname, '../src/assets/custom-elements.js'), script, err => {
        if (err) {
          console.log(err);
          process.exit(0);
        } else {
          console.log('Starting ExoFrontend...');
          ngServe();
        }
      });
    });
})();
