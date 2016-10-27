'use strict';

module.exports = function(logger, config) {
  return Promise.resolve({
    middlewares: [function*(next){
      this.mSucc({
        sum: 3
      });
      yield next;
    }]
  });
};
