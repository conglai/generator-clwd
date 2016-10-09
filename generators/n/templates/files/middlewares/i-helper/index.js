'use strict';
//# 接口辅助中间件
module.exports = function(logger, config) {
  //## 失败
  const mFail = function(status) {
    this.body = `{"status":${status}, "msg":"${status}"}`;
  };
  //## 错误编码常量
  const MF = {
    UNKOWN: -1, //未知错误
    SIGN_FAIL: -2,  //签名失败
    PARAM_LOSS: -3, //参数缺失
  };
  //## 成功
  const mSucc = function(data) {
    this.body = `{"status":200, "data":${JSON.stringify(data)}}`;
  };
  return Promise.resolve({
    middlewares: [function*(next) {
      this.MF = MF;
      this.mFail = mFail;
      this.mSucc = mSucc;
      yield next;
    }]
  });
}
