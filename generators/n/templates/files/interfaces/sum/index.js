'use strict';

module.exports = function(logger, config) {
  return Promise.resolve({
    params: {
      id: Number,
    },
    middlewares: [function*(next){
      if(this.params.id > 11) {
        this.mFail(this.MF.PARAM_LOSS);
      } else {
        this.mSucc({
          aa:1
        });
      }
      yield next;
    }]
  });
};
