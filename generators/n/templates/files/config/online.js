'use strict';
const staticConfig = require('./static');
const Immutable = require('immutable');

let config = Object.assign(staticConfig, {
});

module.exports = Immutable.fromJS(config);
