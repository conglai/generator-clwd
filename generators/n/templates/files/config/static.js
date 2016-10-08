'use strict';
const path = require('path');
module.exports = {
  version: '0.3.2',
  port: 7111,
  rootPath: path.normalize(__dirname + '/..'),
  commonMiddlewares: ['logger'],
  defaultRouter: 'error',
};
