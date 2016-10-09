'use strict';
//# 埋点中间件
const uaParser = require('ua-parser-js');
module.exports = function(logger, config) {
    function log(ctx) {
      if(ctx.status === 200) {
        logger.info('>>>log.request:' + JSON.stringify(ctx.request));
        logger.info('>>>log.body:' + ctx.body);
        let transfer = ctx.body.length / 1024;
        logger.info(`>>>log.res-end:${ctx.href}>>>${ctx.ipStr}>>>cost(${Date.now() - ctx.beginTime}ms)>>>transfer(${transfer.toFixed(2)}KB)`);
      } else {
        logger.info(`>>>log.res-error:${ctx.href} error with status ${ctx.status}.`);
      }
    }
  return Promise.resolve({
    middlewares: [function*(next) {
      let uaStr = this.request.header['user-agent'];
      this.ua = uaParser(uaStr);
      this.beginTime = Date.now();
      let ipStr = this.header['x-real-ip'] || this.ip || '';
      this.ipStr = ipStr.replace('::ffff:', '');

      let ctx = this;
      let res = this.res;
      let onfinish = done.bind(null, 'finish');
      let onclose = done.bind(null, 'close');
      res.once('finish', onfinish);
      res.once('close', onclose);

      function done(event){
        res.removeListener('finish', onfinish);
        res.removeListener('close', onclose);
        log(ctx);
      }
      logger.info(`>>>log.res-begin:${ctx.href}>>>${ctx.ipStr}`);
      yield next;
    }]
  });
}
