'use strict';
const rootPath = _testHelper.rootPath;
const loadMoudles = require(`${rootPath}/utils/load-modules`);
const co = require('co');
describe('加载模块测试', () => {
  it('成功加载模块', () => {
    return co(function*(){
      let dep1 = { test: 0 };
      let dep2 = { test: 0 };
      let map = yield loadMoudles({
        path: __dirname + '/examples',
        deps: [dep1, dep2]
      });
      map.should.have.keys('dir1', 'dir2');
      dep1.test.should.be.equal(2);
      dep2.test.should.be.equal(4);
    });
  });
  it('修改默认地址', () => {
    return co(function*(){
      let dep1 = { test: 0 };
      let dep2 = { test: 0 };
      let map = yield loadMoudles({
        path: __dirname + '/examples-1',
        deps: [dep1, dep2],
        defaultFile: 'router',
        attach: {
          common: 'xx'
        }
      });
      map.should.have.keys('dir1', 'dir2');
      map['dir1'].common.should.be.equal('xx');
      map['dir2'].common.should.be.equal('xxx');
      dep1.test.should.be.equal(2);
      dep2.test.should.be.equal(4);
    });
  });
});
