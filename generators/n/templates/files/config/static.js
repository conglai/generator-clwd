'use strict';
const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
module.exports = {
  version: '0.3.2',
  port: process.env.WEB_PORT || 7111,
  rootPath: rootPath,
  assets: {
    cdnHost: '',
  },
  defaultRouter: ['p','home'],
  env: process.env.NODE_ENV || 'dev'
};
