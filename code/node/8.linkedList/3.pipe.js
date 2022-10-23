const ReadStream = require('./ReadStream')
const WriteStream = require('./WriteStream')

let rs = new ReadStream('./test.text', {
    highWaterMark: 4
});
let ws = new WriteStream('./copy.text', {
    highWaterMark: 1
});
//拷贝功能是异步的，内部的实现是基于发布订阅模式的
rs.pipe(ws);