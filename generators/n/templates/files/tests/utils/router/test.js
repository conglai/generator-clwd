'use strict';
const rootPath = _testHelper.rootPath;
const routerFunc = require(`${rootPath}/utils/router`);
const co = require('co');
const sinon = require('sinon');
function* noop(){}
describe('基础路由中间件', () => {
  let routerM, routerMap, middlewareMap, logger;
  beforeEach(() => {
    middlewareMap = {
      'pre': {
        middlewares: [function*(next){
          this.num = this.num ? this.num + 1: 1;
          yield next;
        }]
      },
      'preA': {
        middlewares: [function*(next){
          this.num = 1;
          yield next;
        }]
      },
    };
    routerMap = {
      'i': {
        error: {
          middlewares: ['pre',function*(next){
            this.num += 1;
            yield next;
          }]
        },
        example: {
          commonMiddlewares: ['preA'],
          middlewares: ['pre',function*(next){
            this.num += 2;
            yield next;
          }]
        },
      }
    };
    logger = { info: sinon.spy() };
    routerM = routerFunc({
      middlewareMap: middlewareMap,
      routerMap: routerMap,
      defaultRouter: ['i', 'error'],
      logger: logger
    });
  });
  it('调用默认的路由', () => {
    let ctx = {
      path: ''
    };
    let next = noop();
    return co(function*(){
      next = routerM.call(ctx, next);
      yield* next;
      ctx.num.should.be.equal(2);
      ctx.gRouter.should.be.equal(routerMap.i.error);
      ctx.gRouterKeys.should.be.eql(['i', 'error']);
      logger.info.should.be.calledOnce();
    });
  });
  it('调用example的路由', () => {
    let ctx = {
      path: '/i/example'
    };
    let next = noop();
    return co(function*(){
      next = routerM.call(ctx, next);
      yield* next;
      ctx.num.should.be.equal(4);
      ctx.gRouter.should.be.equal(routerMap.i.example);
      ctx.gRouterKeys.should.be.eql(['i', 'example']);
      logger.info.should.be.calledOnce();
    });
  });
});
