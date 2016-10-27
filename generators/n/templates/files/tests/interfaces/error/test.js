'use strict';
const rootPath = _testHelper.rootPath;
const mockRouter = _testHelper.mockRouter;

const co = require('co');
const request = require('supertest');

describe('示例接口测试', () => {
  let app;
  beforeEach(() => {
    return co(function*(){
      app = yield mockRouter(['i-helper'], 'error', [{},{}]);
    });
  });
  it('测试返回值', done => {
    request(app.listen())
      .get('/')
      .expect(200)
      .end((err, res) => {
        if(err) {
          done(err);
        } else {
          res.text.should.be.equal('{"status":200, "data":{"sum":3}}');
          done();
        }
      });
  });
});
