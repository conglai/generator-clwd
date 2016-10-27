'use strict';
const appStartTime = Date.now();
const envKey = process.env.NODE_ENV || 'dev';
//# 加载配置文件
const config = require('./config/' + envKey);
const rootPath = config.get('rootPath');
const port = config.get('port');
//# 初始化日志模块
const logger = require(`${rootPath}/utils/logger`)(config);

//# 初始化Koa
const koa = require('koa');
const app = koa();
app.on('error', e => {
  logger.error('>>>app.error:');
  logger.error(e);
});

//# 加载辅助函数
const loadModules = require(`${rootPath}/utils/load-modules`);
//# 主路由工厂函数
const mainRouterFunc = require(`${rootPath}/utils/router`);
const co = require('co');

//# 应用初始化
co(function*(){
  let deps = [logger, config];
  let middlewareMap = yield loadModules({ path: `${rootPath}/middlewares`, deps: deps });
  let interfaces = yield loadModules({
    path: `${rootPath}/interfaces`,
    deps: deps,
    attach: {
      commonMiddlewares: ['stats', 'session', 'i-helper'],
      generateSession: false, // 用于是否生成cookie
    }
  });
  let routerMap = {
    i: interfaces
  };

  app.use(mainRouterFunc({
    middlewareMap: middlewareMap,
    routerMap: routerMap,
    defaultRouter: ['i', 'error'], //设置默认路由
    logger: logger
  }));
  app.listen(port, () => {
    logger.info(`App start cost ${Date.now() - appStartTime}ms. Listen ${port}.`);
  });
}).catch(e => {
  logger.fatal('>>>init.fatal-error:');
  logger.fatal(e);
});

