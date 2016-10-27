'use strict';
const fs = require('fs');
const co = require('co');
//# 加载目录下的模块
// * config.path(*): 目录路径
// * config.deps(*): 依赖的数组
// * config.pre: map中的前缀
// * config.defaultFile: 默认加载的文件名
// * config.attach: 附加上的配置
// return Promise.resolve(Map);
module.exports = function(args) {
  let files = fs.readdirSync(args.path);
  args.defaultFile = args.defaultFile || 'index';
  return co(function*(){
    let map = {};
    let keys = [];
    if(args.attach) {
      keys = Object.keys(args.attach);
    }
    for(let i = files.length - 1; i >= 0; i --) {
      let file = files[i];
      let fullPath = `${args.path}/${file}`;
      let stat = fs.lstatSync(fullPath);
      if(stat.isDirectory()) {
        let filePath = `${fullPath}/${args.defaultFile}.js`;
        let modFunc = require(filePath);
        let modObj = yield modFunc.apply({}, args.deps);
        let name = modObj.name || file;
        keys.forEach(key => {
          modObj[key] = modObj[key] || args.attach[key];
        });
        map[name] = modObj;
      }
    }
    return map;
  });
};
