
let log = () => {};
if(process.env !== 'production' && console) {
  log = function() {
    console.log.apply(console, arguments);
  };
}

let unf;
if (typeof Array.prototype.forEach !== 'function') {
  Array.prototype.forEach = function(callback){
    for (let i = 0; i < this.length; i++){
      callback.apply(this, [this[i], i, this]);
    }
  };
}
if(!$.now) {
  $.now = () => {
    return new Date().getTime();
  };
}
module.exports = {
  log: log,
  parseQuery: function(str) {
    let result = {};
    let item = '';
    let itemNotOver = 0;
    for (let i = 0, l = str.length; i < l; i++) {
      let char = str[i];
      if(char === '[') {
        itemNotOver ++;
      } else if(char === ']') {
        itemNotOver --;
      }
      if(char !== '&' || itemNotOver) {
        item += char;
      } else {
        let res = item.split('=');
        result[res[0]] = res[1];
        item = '';
      }
    }
    if(item){
      let res = item.split('=');
      result[res[0]] = res[1];
    }
    return result;
  },
  stringifyQuery: function(obj) {
    let keys = Object.keys(obj);
    let result = '';
    keys.forEach(key => {
      result += `${key}=${obj[key]}`;
    });
    return result;
  },
  lazyScroll: function(checkFunc, time){
    time = time || 100;
    let timer;
    let lastTime = $.now();
    $(window).on('scroll', () => {
      let currentTime = $.now();
      if(timer) {
        clearTimeout(timer);
        timer = null;
      }
      if(currentTime - lastTime > time) {
        lastTime = currentTime;
        checkFunc();
      } else {
        timer = setTimeout(()=> {
          checkFunc();
        }, time);
      }
    });
  },
};
