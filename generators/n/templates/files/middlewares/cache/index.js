'use strict';
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
//# redis缓存
module.exports = function(logger, config) {
  const KEY_PRE = config.getIn(['redis', 'pre']);
  let client = redis.createClient(config.get('redis'));
  let cacheHelper = {
    cache: function(key, str, time) {
      key = KEY_PRE + key;
      let arr = [key, str];
      if (time) {
        arr.push('PX');
        arr.push(time);
      }
      return client.setAsync(arr);
    },
    get: function(key) {
      return client.getAsync(KEY_PRE + key);
    },
    getClient: function() {
      return client;
    }
  };
  return Promise.resolve({
    middlewares: [function*cache(next) {
      this.mCache = cacheHelper;
      yield next;
    }]
  });
};
