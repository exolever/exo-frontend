// Karma configuration file, see link for more information
// https://karma-runner.github.io/2.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    autoWatch: true,
    basePath: '',
    browserNoActivityTimeout: 2000000,
    browserDisconnectTolerance: 4,
    browserDisconnectTimeout: 100000,
    processKillTimeout: 15000,
    browsers: ['Chrome'],
    client:{
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        timeoutInterval: 2500000,
        random: false
      }
    },
    colors: true,
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 52
      }
    },
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--disable-translate',
          '--disable-extensions',
          '--no-sandbox',
          '--remote-debugging-port=9222',
          '--user-data-dir=/tmp/chrome-test',
          '--watch=false',
          '--code-coverage',
          '--source-map=false',
          '--single-run',
          '--no-proxy-server'
        ]
      }
    },
    files: [
      { pattern: './src/assets/i18n/*.json', watched: false, included: false },
      './src/app/testing/mocks/maps.googleapi.js',
      './node_modules/quill/dist/quill.min.js',
    ],
    frameworks: ['parallel', 'jasmine', '@angular-devkit/build-angular'],

    logLevel: config.LOG_INFO,
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    plugins: [
      require('karma-jasmine'),
      require('karma-parallel'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-teamcity-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    parallelOptions: {
      executors: 4, // Defaults to cpu-count - 1
      shardStrategy: 'round-robin'
    },
    port: 9876,
    jasmineNodeOpts: {
      defaultTimeoutInterval: 2500000
    },
    reporters: ['progress', 'coverage-istanbul'],
    reportSlowerThan: 1000, // Set to 1 to see time to each test
    singleRun: false
  });
};
