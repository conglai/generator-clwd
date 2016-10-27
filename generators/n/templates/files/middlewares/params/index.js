'use strict';
module.exports = function(logger, config) {
  return Promise.resolve({
    middlewares: [function*params(next) {
      let paramSchema = this.router.params;
      this.params = this.query;
      yield next;
    }]
  });
};
