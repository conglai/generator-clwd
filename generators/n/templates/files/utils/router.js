'use strict';
//# 主路由
module.exports = function(args){
  let middlewareMap = args.middlewareMap;
  let routerMap = args.routerMap;
  let defaultRouter = args.defaultRouter;
  let logger = args.logger;
  return function*(next) {
    let urlArgs = this.path.split('/');
    let mapKey = urlArgs[1];
    let routerName = urlArgs[2];
    let urlParams = urlArgs.slice(3);
    let router;
    if(!routerMap[mapKey] || !routerMap[mapKey][routerName]) {
      mapKey = defaultRouter[0];
      routerName = defaultRouter[1];
    }
    router = routerMap[mapKey][routerName];
    logger.info(`Matched router:{ mapKey: ${mapKey} routerName: ${routerName}}`);

    let middlewareItems = router.middlewares;
    if(router.commonMiddlewares) {
      middlewareItems = router.commonMiddlewares.concat(middlewareItems);
    }
    let middlewares = [];
    middlewareItems.forEach(key => {
      if(typeof key === 'string') {
        middlewares = middlewares.concat(middlewareMap[key].middlewares);
      } else if(key.constructor.name === 'GeneratorFunction') {
        middlewares.push(key);
      }
    });

    for (let i = middlewares.length - 1; i >= 0; i--) {
      next = middlewares[i].call(this, next);
    }
    this.gRouter = router;
    this.gRouterKeys = [ mapKey, routerName ];
    this.gUrlParams = urlParams;

    yield *next;
  };
};
