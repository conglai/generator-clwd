'use strict';
const rootPath = _testHelper.rootPath;
const mockMiddleware = _testHelper.mockMiddleware;

const co = require('co');
const request = require('supertest');

describe('接口辅助函数中间件测试', () => {
  let app;
  beforeEach(() => {
    return co(function*(){
      app = yield mockMiddleware('i-helper', [{}, {}]);
    });
  });
  it('成功的辅助函数', done => {
    app.use(function*(next){
      this.mSucc.should.be.a.Function();
      this.mFail.should.be.a.Function();
      this.MF.should.be.a.Object();
      this.mSucc({});
    });
    request(app.listen())
      .get('/')
      .expect(200)
      .end((err, res) => {
        if(err) {
          done(err);
        } else {
          res.text.should.be.equal('{"status":200, "data":{}}');
          done();
        }
      });
  });
  it('失败的辅助函数', done => {
    app.use(function*(next){
      this.mFail(this.MF.UNKOWN);
      yield next;
    });
    request(app.listen())
      .get('/')
      .expect(200)
      .end((err, res) => {
        if(err) {
          done(err);
        } else {
          res.text.should.be.equal('{"status":-1, "msg":"未知错误"}');
          done();
        }
      });
  });
});
