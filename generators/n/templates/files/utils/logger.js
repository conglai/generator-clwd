'use strict';
const log4js = require('log4js');
module.exports = function(config) {
  let env = config.get('env');
  let appenders = [{ type: 'console', category: '[dev]' }];
  log4js.configure({
    appenders: [{ type: 'console' }],
    replaceConsole: true
  });
  let logger = log4js.getLogger(`[${env}]`);
  if(env === 'dev') {
    logger.setLevel('debug');
  } else {
    legger.setLevel('info');
  }
  return logger;
};
