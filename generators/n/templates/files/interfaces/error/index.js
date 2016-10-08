'use strict';

module.exports = function(logger, config) {
  return Promise.resolve({
    params: {

    },
    middlewares: ['params', function*(next){

    }]
  });
};
