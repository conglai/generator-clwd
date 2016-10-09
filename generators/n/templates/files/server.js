'use strict';
const appStartTime = Date.now();
const envKey = process.env.NODE_ENV || 'dev';
//# 加载配置文件
const config = require('./config/' + envKey);
//# 初始化日志模块
const logger = require(`${config.rootPath}/utils/logger`)(config);

//# 初始化Koa
const koa = require('koa');
const app = koa();
app.on('error', e => {
  logger.error('app error', e);
});

//# 加载辅助函数
const loadModules = require(`${config.rootPath}/utils/load-modules`);
const co = require('co');

//# 应用初始化
co(function*(){
  let middlewareMap = {};
  let middlewareFuncs = loadModules(`${config.rootPath}/middlewares`);
  for (let i = middlewareFuncs.length - 1; i >= 0; i--) {
    let middlewareFunc = middlewareFuncs[i].mod;
    let middlewareName = middlewareFuncs[i].name;
    let middlewareConfig = yield middlewareFunc(logger, config);
    middlewareName = middlewareConfig.name || middlewareName;
    middlewareMap[middlewareName] = middlewareConfig;
    logger.info(`Add middleware:${middlewareName}.`);
  }
  let routerMap = {};
  let routerFuncs = loadModules(`${config.rootPath}/interfaces`);
  for (let i = routerFuncs.length - 1; i >= 0; i--) {
    let routerFunc = routerFuncs[i].mod;
    let routerName = routerFuncs[i].name;
    let routerConfig = yield routerFunc(logger, config);
    routerName = routerConfig.name || routerName;
    routerMap[routerName] = routerConfig;
    logger.info(`Add router:${routerName}.`);
  }

  let commonMiddlewares = config.commonMiddlewares;
  app.use(function*(next){
    let matchedRouterName = this.path.replace('/', '');
    let router = routerMap[matchedRouterName];
    router = router || routerMap[config.defaultRouter];
    this.router = router;
    let middlewareItems = commonMiddlewares.concat(router.middlewares);
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
    yield *next;
  });
  app.listen(config.port);
  logger.info(`App start cost ${Date.now() - appStartTime}ms.`);
  logger.info(`Listen ${config.port}.`);
}).catch(e => {
  logger.fatal(e);
});

