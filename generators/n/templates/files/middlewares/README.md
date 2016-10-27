# 中间件目录

> 注意：中间件格式需要符合如下接口类型

```js
'use strict';
//实例化方法
module.exports = function(logger, config) {
  //返回Promise
  return Promise.resolve({
    //注意：中间件中数组必须是Generator函数
    middlewares: [function*(next) {
      //操作
      yield next;
    }]
  });
};

```
