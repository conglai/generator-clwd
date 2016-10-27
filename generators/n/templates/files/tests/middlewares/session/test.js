'use strict';
const rootPath = _testHelper.rootPath;
const mockMiddleware = _testHelper.mockMiddleware;

const co = require('co');
const request = require('supertest');
const config = require(`${rootPath}/config/dev`);

describe('Session中间件测试', () => {
  let app;
  beforeEach(() => {
    return co(function*() {
      app = yield mockMiddleware('session', [{}, config], ['cache'], { generateSession: true });
    });
  });
  it('测试包含依赖', done => {
    app.use(function*(next) {
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
          done();
        }
      });
  });
});
