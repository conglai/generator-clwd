'use strict';
module.exports = function(app, config) {
  return Promise.resolve({
    middlewares: [function*(next) {
      this.mLogger = { info: () => {} };
      yield next;
    }]
  });
}
