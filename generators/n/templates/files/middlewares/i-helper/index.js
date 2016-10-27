'use strict';
//# 接口辅助中间件
//## 错误编码常量
const MF = {
  UNKOWN: -1,
  SIGN_FAIL: -2,
  PARAM_LOSS: -3,
  UNKOWN_SOURCE: -4,
};
const MFTEXT = {
  '-1': '未知错误',
  '-2': '签名失败',
  '-3': '参数缺失',
  '-4': '未知来源',
};
//## 失败
const mFail = function(status) {
  this.body = `{"status":${status}, "msg":"${MFTEXT[status]}"}`;
};
//## 成功
const mSucc = function(data) {
  this.body = `{"status":200, "data":${JSON.stringify(data)}}`;
};
module.exports = function(logger, config) {
  return Promise.resolve({
    middlewares: [function*ihelper(next) {
      this.MF = MF;
      this.mFail = mFail;
      this.mSucc = mSucc;
      yield next;
    }]
  });
};
