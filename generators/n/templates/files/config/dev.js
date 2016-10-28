'use strict';
const staticConfig = require('./static');
const Immutable = require('immutable');

let config = Object.assign(staticConfig, {
  redis: {
    host: '127.0.0.1',
    port: 6379,
    pre: 'base.node.app.'
  },
  pug: {
    basedir: `${staticConfig.rootPath}/templates`,
    debug: true,
    compileDebug: true
  },
  assets: {
    pageAssets: '//localhost:12126/'
  }
});

module.exports = Immutable.fromJS(config);
