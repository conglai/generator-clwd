'use strict';
const path = require('path');
const should = require('should');
require('should-sinon');
const rootPath = path.normalize(__dirname + '/../');
const co = require('co');
const koa = require('koa');

// console.log('>>>>>test helper init');

//## 清空测试产生的Redis Client
function listenForQuitCache(ctx) {
  let res = ctx.res;
  let onfinish = done.bind(null, 'finish');
  let onclose = done.bind(null, 'close');
  res.once('finish', onfinish);
  res.once('close', onclose);

  function done(event){
    res.removeListener('finish', onfinish);
    res.removeListener('close', onclose);
    if(ctx.mCache) {
      // 测试的时候请一定记得关闭客户端！！！！！
      ctx.mCache.getClient().quit();
    }
  }
}

global._testHelper = {
  rootPath: rootPath,
  //## 模拟中间件
  // * middlewareName: 中间件名
  // * deps: 依赖数组
  // * depMiddlewares: 依赖的中间件数组
  // * router: mock的路由，ctx.gRouter
  // Return app:koa
  mockMiddleware: function(middlewareName, deps, depMiddlewares, router) {
    depMiddlewares = depMiddlewares || [];
    return co(function*(){
      depMiddlewares.push(middlewareName);
      let middlewares = [];
      for (let i = 0, l = depMiddlewares.length; i < l ; i++) {
        let mName = depMiddlewares[i];
        let mFunc = require(`${rootPath}/middlewares/${mName}/`);
        let m = yield mFunc.apply(this, deps);
        middlewares = middlewares.concat(m.middlewares);
      }
      let app = koa();
      app.use(function*(next){
        this.gRouter = router;
        for (let i = middlewares.length - 1; i >= 0; i--) {
          next = middlewares[i].call(this, next);
        }
        listenForQuitCache(this);
        yield *next;
      });
      return app;
    });
  },
  //## 模拟路由
  // * middlewares: 中间件数组，比如['i-helper', 'cache']
  // * routerName: 路由名
  // * deps: 工厂传递的参数数组
  // * dir: 路由所在的目录
  // Return app:koa
  mockRouter: function(middlewares, routerName, deps, dir) {
    dir = dir || 'interfaces';
    return co(function*(){
      let rFunc = require(`${rootPath}/${dir}/${routerName}/`);
      let router = yield rFunc.apply(this, deps);
      middlewares = middlewares.concat(router.middlewares);
      let ms = [];
      for (let i = 0, l = middlewares.length; i < l ; i++) {
        let m = middlewares[i];
        if(typeof m === 'string') {
          let mFunc = require(`${rootPath}/middlewares/${m}/`);
          let mItem = yield mFunc.apply(this, deps);
          ms = ms.concat(mItem.middlewares);
        } else if(m.constructor.name === 'GeneratorFunction') {
          ms.push(m);
        }
      }
      let app = koa();
      app.use(function*(next){
        for (let i = ms.length - 1; i >= 0; i--) {
          next = ms[i].call(this, next);
        }

        listenForQuitCache(this);
        if(next.next) {
          yield *next;
        } else {
          yield next;
        }
      });
      return app;
    });
  },
  //## 等待
  wait: function(time) {
    return new Promise(resolve => {
      setTimeout(resolve, time);
    });
  }
};
