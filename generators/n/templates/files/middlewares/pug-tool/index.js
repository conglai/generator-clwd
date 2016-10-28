'use strict';
const pug = require('pug');
const fs = require('fs');


//# pug渲染中间件
module.exports = function(logger, config) {
  const pugOptions = config.get('pug');
  const rootPath = config.get('rootPath');
  const pageAssets = config.getIn(['assets', 'pageAssets']);

  let getDefaultData;
  function getPageData(pageName){
    return {
      pageCSS: `${pageAssets}${pageName}.css`,
      pageJS: `${pageAssets}${pageName}.js`,
      libJS: '//cdn.withme.cn/withme.web.lib.jquery-2.2.4.min.js?t=20160805',
      jsData: '{}'
    };
  }
  if(config.get('env') === 'dev') {
    getDefaultData = path => {
      let jsonStr = fs.readFileSync(path, 'utf8');
      return JSON.parse(jsonStr);
    };
  } else {
    getDefaultData = path => {
      return require(path);
    };
  }

  function mRender(dir, options){
    let filename = `${dir}/node.tpl.pug`;
    let defaultDataFile = `${dir}/node.data.json`;
    let defaultData = getDefaultData(defaultDataFile);
    let pageData = getPageData(this.gRouterKeys[1]);
    options = options || {};
    options = Object.assign(pugOptions.toJS(), pageData, defaultData, options);
    options.filename = filename;
    this.body = pug.renderFile(filename, options);
  }

  return Promise.resolve({
    middlewares: [function*pugTool(next) {
      this.mRender = mRender;
      yield next;
    }]
  });
};
