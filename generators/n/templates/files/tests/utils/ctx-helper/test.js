'use strict';
const rootPath = _testHelper.rootPath;
const obj = require(`${rootPath}/utils/ctx-helper`);
const co = require('co');
const sinon = require('sinon');
const koa = require('koa');
const request = require('supertest');

describe('测试Ctx的辅助方法', () => {

  it('监听response结束', done => {
    let app = koa();
    let overCb = sinon.spy();
    app.use(function*(next){
      obj.listenResOver(this.res, overCb);
      this.body = 'hello, world!';
      yield next;
    });
    request(app.listen())
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          res.text.should.be.equal('hello, world!');
          overCb.should.be.calledOnce();
          done();
        }
      });
  });
});
