'use strict';
const rootPath = _testHelper.rootPath;
const mockMiddleware = _testHelper.mockMiddleware;
const wait = _testHelper.wait;

const co = require('co');
const request = require('supertest');
const should = require('should');
const config = require(`${rootPath}/config/dev`);

describe('缓存中间件测试', () => {
  let app;
  beforeEach(() => {
    return co(function*() {
      app = yield mockMiddleware('cache', [{}, config]);
    });
  });
  it('测试缓存', done => {
    app.use(function*(next) {
      this.body = 'hello, world!';
      let str = 'ss';
      for (let i = 10; i >= 0; i--) {
        str += 'sssssssxxxxxxx';
      }
      let time = Date.now();
      yield this.mCache.cache('test', str);
      let str2 = yield this.mCache.get('test');
      // console.log(`cache cost:${Date.now() - time}ms. String length:${str.length / 1024}KB`);
      str2.should.be.equal(str);

      let dataStr = 'xx' + time;
      yield this.mCache.cache('test1', dataStr, 4);
      let str3 = yield this.mCache.get('test1');
      str3.should.be.equal(dataStr);
      // console.log(`str3:${str3}`);
      yield wait(10);
      let str4 = yield this.mCache.get('test1');
      should.not.exist(str4);
      // console.log(`str4:${str4}`);

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
