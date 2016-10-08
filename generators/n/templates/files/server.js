'use strict';
const envKey = process.env.NODE_ENV || 'dev';
//# 加载配置文件
const config = require('./config/' + envKey);

//# 初始化Koa
const koa = require('koa');
const app = koa();

//# 加载辅助函数
const loadModules = require(`${config.rootPath}/utils/load-modules`);
const co = require('co');

//# 初始化
co(function*(){
  let middlewareMap = {};
  let middlewareFuncs = loadModules(`${config.rootPath}/middlewares`);
  for (let i = middlewareFuncs.length - 1; i >= 0; i--) {
    let middlewareFunc = middlewareFuncs[i].mod;
    let middlewareName = middlewareFuncs[i].name;
    let middlewareConfig = yield middlewareFunc(app, config);
    middlewareName = middlewareConfig.name || middlewareName;
    middlewareMap[middlewareName] = middlewareConfig;
  }
  let routerMap = {};
  let routerFuncs = loadModules(`${config.rootPath}/interfaces`);
  for (let i = routerFuncs.length - 1; i >= 0; i--) {
    let routerFunc = routerFuncs[i].mod;
    let routerName = routerFuncs[i].name;
    let routerConfig = yield routerFunc(app, config);
    routerName = routerConfig.name || routerName;
    routerMap[routerName] = routerConfig;
  }

  let commonMiddlewares = config.commonMiddlewares;
  app.use(function*(next){
    let matchedRouterName = this.path.replace('/', '');
    let router = routerMap[matchedRouterName];
    router = router || routerMap[config.defaultRouter];
    this.router = router;
    let middlewares = commonMiddlewares.concat(router.middlewares);
    for (let i = 0, l = middlewares.length; i < l; i++) {
      let middleware = middlewares[i];
      if(typeof middleware === 'string') {
        middleware = middlewareMap[middleware];
      }
      if(middleware.constructor.name === 'GeneratorFunction') {
        next = middlewares[i].call(this, next);
      }
    }
    if (typeof next.next === 'function') {
      yield *next;
    } else {
      yield next;
    }
  });
  app.listen(config.port);
  console.log(`listen ${config.port}`);
});

