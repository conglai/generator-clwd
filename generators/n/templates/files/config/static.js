'use strict';
const path = require('path');
module.exports = {
  version: '0.3.2',
  port: process.env.WEB_PORT || 7111,
  rootPath: path.normalize(__dirname + '/..'),
  commonMiddlewares: ['stats', 'params', 'i-helper'],
  defaultRouter: 'example',
  env: process.env.NODE_ENV || 'dev'
};
