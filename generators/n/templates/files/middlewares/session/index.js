'use strict';
//# Session中间件，依赖于`../cache/`
const md5 = require('spark-md5');

module.exports = function(logger, config) {
  const sessionCookieKey = config.getIn(['session', 'cookieKey']);
  const sessionSecret = config.getIn(['session', 'secret']);
  return Promise.resolve({
    middlewares: [function*session(next) {
      let pub = this.cookies.get(sessionCookieKey);
      let sign = this.cookies.get(`${sessionCookieKey}.sig`);
      if(sign && pub) {
        let _sign = md5.hash(`${pub}>>>${sessionSecret}`);

      } else if(this.gRouter.generateSession) {
        pub = Math.random() * 10000000;
        pub += 'xxx';
        pub = md5.hash(pub);
        sign = md5.hash(`${pub}>>>${sessionSecret}`);
      } else {
        this.mFail(this.MF.UNKNOW_SOURCE);
        return;
      }
      yield next;
    }]
  });
};
