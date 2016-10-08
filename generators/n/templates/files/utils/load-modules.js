'use strict';
const fs = require('fs');
module.exports = function(dirPath, defaultPath) {
  let arr = [];
  let files = fs.readdirSync(dirPath);
  defaultPath = defaultPath || 'index';
  files.forEach(file => {
    let fullPath = dirPath + '/' + file;
    let stat = fs.lstatSync(fullPath);
    if(file.indexOf('.js') !== -1) {
      let mod = require(fullPath);
      arr.push({
        name: file.replace('.js',''),
        mod: mod
      });
    } else if(stat.isDirectory()) {
      let filePath = `${fullPath}/${defaultPath}.js`;
      try {
        let mod = require(filePath);
        arr.push({
          name: file,
          mod: mod
        });
      } catch(e) {}
    }
  });
  return arr;
};
