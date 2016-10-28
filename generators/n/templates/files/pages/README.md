# 页面目录

## 目录结构
```
- pages
  - home
    - node.main.js // 后端的主入口
    - web.main.js // 前端的主入口
    - web.main.css
```

> 注意：接口需要符合如下接口类型

```js
'use strict';
//实例化方法
module.exports = function(logger, config) {
  //返回Promise
  return Promise.resolve({
    //中间件
    middlewares: ['page', function*(next) {
      //操作
      yield next;
    }]
  });
};

```
