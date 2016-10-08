'use strict';
const log4js = require('log4js');
module.exports = function(config) {
  log4js.configure({
    appenders: [
      { type: 'console', category: '[dev]' },
      {
        type: 'dateFile',
        filename: `_logs/main.log`,
        pattern: '-yyyy-MM-dd',
        alwaysIncludePattern: false,
      }
    ],
    levels: {
      '[dev]': 'DEBUG',
      '[daily]': 'INFO',
      '[online]': 'INFO',
    },
    replaceConsole: true
  });
  let logger = log4js.getLogger(`[${config.env}]`);
  return logger;
};
