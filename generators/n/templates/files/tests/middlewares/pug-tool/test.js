'use strict';
const rootPath = _testHelper.rootPath;
const mockMiddleware = _testHelper.mockMiddleware;

const co = require('co');
const Immutable = require('immutable');
const config = Immutable.fromJS({
  pug: {
    basedir: __dirname + '/tpls'
  },
  env: 'dev'
});
const request = require('supertest');

describe('pug工具中间件测试', () => {
  let app;
  beforeEach(() => {
    return co(function*(){
      app = yield mockMiddleware('pug-tool', [{}, config],[], {
        name: 'xxx'
      });
    });
  });


  it('测试渲染函数', done => {
    app.use(function*(next){
      this.mRender(__dirname + '/other', {
        a: 3
      });
    });
    request(app.listen())
      .get('/')
      .expect(200)
      .end((err, res) => {
        if(err) {
          done(err);
        } else {
          res.text.should.be.equal('<div><div>hello3</div></div><div>3</div>');
          // console.log(res.text);
          done();
        }
      });
  });

  it('测试渲染函数并使用默认数据', done => {
    app.use(function*(next){
      this.mRender(__dirname + '/other');
    });
    request(app.listen())
      .get('/')
      .expect(200)
      .end((err, res) => {
        if(err) {
          done(err);
        } else {
          res.text.should.be.equal('<div><div>hello1</div></div><div>1</div>');
          // console.log(res.text);
          done();
        }
      });
  });
});
