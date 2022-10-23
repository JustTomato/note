const EventEmitter = require('./events'); // 内置模块 核心
const util = require('util')
function Girl(){};
// Girl.prototype = Object.create(EventEmitter.prototype)
// Girl.prototype.__proto__ = EventEmitter.prototype;
// Object.setPrototypeOf(Girl.prototype,EventEmitter.prototype);
util.inherits(Girl,EventEmitter)
let girl = new Girl();
console.log(girl.on)
girl.on('newListener',function(type){
    console.log(type)
})
girl.once('女生失恋了',function(a,b,c){
    console.log('cry',a,b,c)
})
let eat = function(){
    console.log('eat')
}
girl.on('女生失恋了',eat)
girl.off('女生失恋了',eat)
girl.emit('女生失恋了',1,2,3);
girl.emit('女生失恋了');