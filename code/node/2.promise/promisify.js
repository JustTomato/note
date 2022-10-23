const fs = require('fs');
const util = require('util'); //node的内置模块

function promisifyAll(target){
  Reflect.ownKeys(target).forEach(key => {
      if(typeof target[key] === 'function'){
         target[key + 'Async'] = util.promisify(target[key])
      }
  })
  return target;
}
let obj = promisifyAll(fs);
obj.readFileAsync('age.txt','utf8').then(data => {
  console.log(data);
})