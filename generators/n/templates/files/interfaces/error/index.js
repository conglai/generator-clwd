'use strict';

module.exports = function(app, config) {
  return Promise.resolve({
    params: {

    },
    middlewares: ['params', function*(next){

    }];
  });
};
