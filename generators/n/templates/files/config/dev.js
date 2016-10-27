'use strict';
const staticConfig = require('./static');
const Immutable = require('immutable');

let config = Object.assign(staticConfig, {
  redis: {
    host: '127.0.0.1',
    port: 6379,
    pre: 'base.node.app.'
  },
});

module.exports = Immutable.fromJS(config);
