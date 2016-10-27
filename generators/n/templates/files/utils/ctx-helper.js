'use strict';
module.exports = {
  //## 监听res结束
  listenResOver: function(res, cb) {
    let onfinish = done.bind(null, 'finish');
    let onclose = done.bind(null, 'close');
    res.once('finish', onfinish);
    res.once('close', onclose);

    function done(event){
      res.removeListener('finish', onfinish);
      res.removeListener('close', onclose);
      cb && cb();
    }
  }
};
