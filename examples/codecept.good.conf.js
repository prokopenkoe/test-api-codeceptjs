const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  
  BaseUrl: 'https://petstore.swagger.io/v2',
  tests: './good/*/*.js',

  output: '../output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost',
      show: false,
      windowSize: '1200x900'
    }
  },
  include: {
    I: '../steps_file.js',
    API_TIMEOUT: 5000,
    API_HEADERS: {
      'Content-Type': 'application/json', 
      'Accept': 'application/json',
    },

  },
}