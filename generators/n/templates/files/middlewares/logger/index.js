'use strict';
module.exports = function(app, config) {
  return Promise.resolve({
    middlewares: [function*(next) {
      this.mParams = {
        key: 1,
        a: 2
      };
      yield next;
    }]
  });
}
