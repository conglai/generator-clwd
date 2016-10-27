'use strict';

module.exports = function(deps1, deps2) {
  deps1.test +=1;
  deps2.test +=2;
  return Promise.resolve({
    test: 2,
    common: 'xxx'
  });
};
