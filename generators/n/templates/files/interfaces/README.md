# 接口目录

> 注意：接口需要符合如下接口类型

```js
'use strict';
//实例化方法
module.exports = function(logger, config) {
  //返回Promise
  return Promise.resolve({
    //中间件
    middlewares: ['i-helper', function*(next) {
      //操作
      yield next;
    }]
  });
};

```
